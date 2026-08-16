import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { useState, useCallback, useEffect } from 'react';
import type { ConnectedAPI } from '@midnight-ntwrk/dapp-connector-api';
import { useWalletContext } from '../contexts/WalletContext';
import {
  make as makeCompiledContract,
  withVacantWitnesses,
 withCompiledFileAssets,
} from '@midnight-ntwrk/compact-js/effect/CompiledContract';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { FetchZkConfigProvider } from '@midnight-ntwrk/midnight-js-fetch-zk-config-provider';
import { createProofProvider, type PrivateStateProvider, type PrivateStateId } from '@midnight-ntwrk/midnight-js-types';
import { deployContract } from '@midnight-ntwrk/midnight-js-contracts';
import { fromHex, toHex } from '@midnight-ntwrk/midnight-js-utils';
import type { ContractAddress } from '@midnight-ntwrk/midnight-js-protocol/compact-runtime';

const INDEXER_URL = 'https://indexer.preview.midnight.network/api/v4/graphql';
const INDEXER_WS_URL = 'wss://indexer.preview.midnight.network/api/v4/graphql';
const ZK_CONFIG_URL = 'https://config.preview.midnight.network';
const LOCAL_STORAGE_KEY = 'zk-scholar-contract-address';

const ZKSCHOLAR_PRIVATE_STATE_ID: PrivateStateId = 'ZKScholarVerifier';

type ZKScholarState = {
  scoreThreshold: bigint;
  incomeThreshold: bigint;
  ageThreshold: bigint;
  claimCount: bigint;
  programCreated: boolean;
};

const INITIAL_PRIVATE_STATE: ZKScholarState = {
  scoreThreshold: 0n,
  incomeThreshold: 0n,
  ageThreshold: 0n,
  claimCount: 0n,
  programCreated: false,
};

setNetworkId('preview');

export function useContractDeployment() {
const { connectedAPI, networkName } = useWalletContext();
  const [isDeploying, setIsDeploying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contractAddress, setContractAddress] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
const [callTx, setCallTx] = useState<any>(null);

  useEffect(() => {
    const savedAddress = localStorage.getItem(LOCAL_STORAGE_KEY);
    const envAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
    const address =
      savedAddress ||
      (envAddress && envAddress !== 'REPLACE_WITH_DEPLOYED_ADDRESS'
        ? envAddress
        : undefined);
    if (address) {
      setContractAddress(address);
    }
  }, []);
useEffect(() => {
  const initializeExistingContract = async () => {
          console.log('CALLTX INIT INPUTS', {
      hasConnectedAPI: !!connectedAPI,
      hasContractAddress: !!contractAddress,
      networkName,
      hasCompiledContract: false
    });
    if (!connectedAPI || !contractAddress) {
  console.log('CALLTX INIT WAITING', {
    hasConnectedAPI: !!connectedAPI,
    hasContractAddress: !!contractAddress,
  });
  return;
}

const effectiveNetwork = networkName || 'preview';

console.log('CALLTX EFFECT READY', {
  hasConnectedAPI: !!connectedAPI,
  contractAddress,
  networkName,
  effectiveNetwork,
});

    try {
      console.log('Initializing callTx for existing contract...');
      console.log('Contract address:', contractAddress);
      console.log('Network:', networkName);

      const config = await connectedAPI.getConfiguration();

      if (config.networkId !== networkName) {
        console.warn(
          `Network mismatch. Wallet: ${config.networkId}, App: ${networkName}`
        );
        return;
      }

      setNetworkId(config.networkId);

      const { Contract } = await import('../../managed/contract/index');

      const zkConfigProvider = new FetchZkConfigProvider(
  ZK_CONFIG_URL,
  fetch.bind(window)
);

      const provingProvider =
        await connectedAPI.getProvingProvider(zkConfigProvider);
      console.log('INIT callTx: getProvingProvider ok');

      const addresses =
        await connectedAPI.getShieldedAddresses() as any;

      const {
        shieldedCoinPublicKey,
        shieldedEncryptionPublicKey,
      } = addresses;

      const walletProvider = {
        balanceTx: async (tx: any): Promise<any> => {
          console.log('Balancing transaction via wallet...');

          const serializedTx = tx.serialize();
          const hexTx = toHex(serializedTx);

          const result =
            await connectedAPI.balanceUnsealedTransaction(hexTx);

          const { Transaction } =
            await import('@midnight-ntwrk/ledger-v8');

          return Transaction.deserialize(
            'signature',
            'proof',
            'binding',
            fromHex(result.tx)
          ) as any;
        },

        getCoinPublicKey: () => shieldedCoinPublicKey as any,

        getEncryptionPublicKey: () =>
          shieldedEncryptionPublicKey as any,
      };

      const midnightProvider = {
  submitTx: async (tx: any): Promise<string> => {
    console.log('🚀 submitTx started');

    try {
      const serializedTx = tx.serialize();
      const hexTx = toHex(serializedTx);

      console.log('📦 Serialized transaction length:', hexTx.length);
      console.log('📤 Calling wallet submitTransaction...');

      const submitResult = await Promise.race([
        connectedAPI.submitTransaction(hexTx),
        new Promise((_, reject) =>
          setTimeout(
            () =>
              reject(
                new Error(
                  'Wallet submitTransaction timed out after 60 seconds'
                )
              ),
            60000
          )
        ),
      ]);

      console.log(
        '✅ Wallet submitTransaction returned:',
        submitResult
      );

      const result = tx.identifiers();
      const txId = result[0];

      console.log('✅ Transaction submitted, ID:', txId);

      return txId;
    } catch (error: any) {
      console.error('❌ submitTx FAILED:', error);
      console.error('❌ Error message:', error?.message);
      console.error('❌ Error stack:', error?.stack);
      throw error;
    }
  },
};
         

      const proofProvider =
        createProofProvider(provingProvider);

      const publicDataProvider =
        indexerPublicDataProvider(
          INDEXER_URL,
          INDEXER_WS_URL
        );

      const privateStateProvider = {
        setContractAddress: (_address: ContractAddress): void => {},

        set: async (
          _privateStateId: PrivateStateId,
          _state: ZKScholarState
        ): Promise<void> => {},

        get: async (
          _privateStateId: PrivateStateId
        ): Promise<ZKScholarState | null> =>
          INITIAL_PRIVATE_STATE,

        remove: async (
          _privateStateId: PrivateStateId
        ): Promise<void> => {},

        clear: async (): Promise<void> => {},

        setSigningKey: async (
          _address: ContractAddress,
          _key: any
        ): Promise<void> => {},

        getSigningKey: async (
          _address: ContractAddress
        ): Promise<any> => null,

        removeSigningKey: async (
          _address: ContractAddress
        ): Promise<void> => {},

        clearSigningKeys: async (): Promise<void> => {},

        exportPrivateStates: async (): Promise<any> => ({
          format: 'midnight-private-state-export',
          encryptedPayload: '',
          salt: '',
        }),

        importPrivateStates: async (): Promise<any> => ({
          imported: 0,
          skipped: 0,
          overwritten: 0,
        }),

        exportSigningKeys: async (): Promise<any> => ({
          format: 'midnight-signing-key-export',
          encryptedPayload: '',
          salt: '',
        }),

        importSigningKeys: async (): Promise<any> => ({
          imported: 0,
          skipped: 0,
          overwritten: 0,
        }),

        privateStates:
          new Map<PrivateStateId, ZKScholarState>([
            [
              ZKSCHOLAR_PRIVATE_STATE_ID,
              INITIAL_PRIVATE_STATE,
            ],
          ]),
      } as PrivateStateProvider<
        PrivateStateId,
        ZKScholarState
      >;

      const compiledContract =
        withCompiledFileAssets(
          withVacantWitnesses(
            makeCompiledContract(
              'ZKScholarVerifier',
              Contract
            )
          ),
          '.'
        );

      const providers = {
        publicDataProvider,
        privateStateProvider,
        zkConfigProvider,
        proofProvider,
        walletProvider,
        midnightProvider,
      };

            console.log('🔵 FINDING DEPLOYED CONTRACT');

const foundContract = await findDeployedContract(
  providers,
  {
    compiledContract,
    contractAddress: contractAddress as ContractAddress,
    privateStateId: ZKSCHOLAR_PRIVATE_STATE_ID,
    initialPrivateState: INITIAL_PRIVATE_STATE,
  }
);

console.log('🟢 DEPLOYED CONTRACT FOUND');
console.log('CALLTX CREATED:', !!foundContract.callTx);

setCallTx(foundContract.callTx);

console.log('CALLTX READY:', !!foundContract.callTx);
    } catch (err: any) {
      console.error('INIT callTx: FAILED to initialize existing contract callTx', err);
      console.error('INIT callTx: error message:', err instanceof Error ? err.message : String(err));
      console.error('INIT callTx: error stack:', err instanceof Error ? err.stack : err);
    }
  };

  initializeExistingContract();
}, [connectedAPI, contractAddress, networkName]);
  const deploy = useCallback(async (connectedAPI: ConnectedAPI, networkId: string) => {
    setIsDeploying(true);
    setError(null);

    try {
      console.log('Starting ZKScholarVerifier contract deployment...');

      const config = await connectedAPI.getConfiguration();
      if (config.networkId !== networkId) {
        throw new Error(`Wallet network mismatch. Expected ${networkId}, got ${config.networkId}`);
      }
      setNetworkId(config.networkId);
  console.log('✓ Network ID configured:', config.networkId);
  console.log('✓ Wallet connected to Midnight Preview');

      const addresses = await connectedAPI.getShieldedAddresses();
      if (!addresses || !(addresses as any).shieldedAddress) {
        throw new Error('No shielded addresses available from wallet');
      }
      console.log('✓ Got addresses from wallet');

      const { Contract } = await import('../../managed/contract/index');
      console.log('✓ Contract loaded');

      // Use FetchZkConfigProvider to get proving keys from the network
      // Note: FetchZkConfigProvider expects a CONFIG server URL, not a prover server URL
      // The wallet's config provides the proverServerUri for proof submission
      
const zkConfigProvider = new FetchZkConfigProvider(
  ZK_CONFIG_URL,
  fetch.bind(window)
);

      const { shieldedCoinPublicKey, shieldedEncryptionPublicKey } = (await connectedAPI.getShieldedAddresses()) as any;
      
      // Get the proving provider from the wallet
      const provingProvider = await connectedAPI.getProvingProvider(zkConfigProvider);
      console.log('✓ ProvingProvider obtained from wallet');
      
      const walletProvider = {
        balanceTx: async (tx: UnboundTransaction): Promise<any> => {
          console.log('Balancing transaction via wallet...');
          const serializedTx = tx.serialize();
          const hexTx = toHex(serializedTx);
          const result = await connectedAPI.balanceUnsealedTransaction(hexTx);

console.log('Balance result:', result);
console.log('result.tx type:', typeof result.tx);

const { Transaction } = await import('@midnight-ntwrk/ledger-v8');

return Transaction.deserialize(
  'signature',
  'proof',
  'binding',
  fromHex(result.tx)
) as any;
        },
        getCoinPublicKey: () => shieldedCoinPublicKey as any,
        getEncryptionPublicKey: () => shieldedEncryptionPublicKey as any,
      };
      console.log('✓ WalletProvider created');

      const midnightProvider = {
        submitTx: async (tx: any): Promise<string> => {
          console.log('Submitting transaction via wallet...');
          const serializedTx = tx.serialize();
          const hexTx = toHex(serializedTx);
          await connectedAPI.submitTransaction(hexTx);
          const result = tx.identifiers();
          console.log('Transaction submitted, ID:', result[0]);
          return result[0];
        },
      };
      console.log('✓ MidnightProvider created');

      const proofProvider = createProofProvider(provingProvider);
      console.log('✓ ProofProvider created');

      const publicDataProvider = indexerPublicDataProvider(INDEXER_URL, INDEXER_WS_URL);
      console.log('✓ PublicDataProvider connected');

      const privateStateProvider = {
        setContractAddress: (_address: ContractAddress): void => {},
        set: async (_privateStateId: PrivateStateId, _state: ZKScholarState): Promise<void> => {},
        get: async (_privateStateId: PrivateStateId): Promise<ZKScholarState | null> => INITIAL_PRIVATE_STATE,
        remove: async (_privateStateId: PrivateStateId): Promise<void> => {},
        clear: async (): Promise<void> => {},
        setSigningKey: async (_address: ContractAddress, key: any): Promise<void> => {},
        getSigningKey: async (_address: ContractAddress): Promise<any> => null,
        removeSigningKey: async (_address: ContractAddress): Promise<void> => {},
        clearSigningKeys: async (): Promise<void> => {},
        exportPrivateStates: async (): Promise<any> => ({ format: 'midnight-private-state-export', encryptedPayload: '', salt: '' }),
        importPrivateStates: async (): Promise<any> => ({ imported: 0, skipped: 0, overwritten: 0 }),
        exportSigningKeys: async (): Promise<any> => ({ format: 'midnight-signing-key-export', encryptedPayload: '', salt: '' }),
        importSigningKeys: async (): Promise<any> => ({ imported: 0, skipped: 0, overwritten: 0 }),
        privateStates: new Map<PrivateStateId, ZKScholarState>([[ZKSCHOLAR_PRIVATE_STATE_ID, INITIAL_PRIVATE_STATE]]),
      } as PrivateStateProvider<PrivateStateId, ZKScholarState>;
      const compiledContract = withCompiledFileAssets(
  withVacantWitnesses(
    makeCompiledContract('ZKScholarVerifier', Contract)
  ),
  '.'
);
console.log('✓ PrivateStateProvider created');


      const providers = {
        publicDataProvider,
        privateStateProvider,
        zkConfigProvider,
        proofProvider,
        walletProvider,
        midnightProvider,
      };

      console.log('\\nDeploying contract...');
      
      const deployOptions = {
        compiledContract,
        privateStateId: ZKSCHOLAR_PRIVATE_STATE_ID,
        initialPrivateState: INITIAL_PRIVATE_STATE,
      };

      const result = await deployContract<typeof compiledContract>(providers, deployOptions as any);

      const address = result.deployTxData.public.contractAddress;
      console.log('✓ Contract deployed successfully!');
      console.log('  Address:', address);
      console.log('  Transaction ID:', result.deployTxData.public.txId);

      localStorage.setItem(LOCAL_STORAGE_KEY, address);
      setContractAddress(address);
      
setTransactionId(result.deployTxData.public.txId);
setCallTx(result.callTx);

      return {
        success: true,
        address,
        transactionId: result.deployTxData.public.txId
      };

    } catch (err: any) {
      console.error('Deployment error:', err);
      const errorMessage = err.message || 'Unknown error during deployment';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsDeploying(false);
    }
  }, []);

  const reset = () => {
    setContractAddress(null);
    setTransactionId(null);
    setError(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

 return {
  isDeploying,
  error,
  contractAddress,
  transactionId,
  callTx,
  deploy,
  reset,
};
}
