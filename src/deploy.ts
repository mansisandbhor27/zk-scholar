import { resolveNetwork } from './network';
import { loadCompiledContract, createProviders } from './contract-client';
import { deployContract } from '@midnight-ntwrk/midnight-js-contracts';
import { HDWallet } from '@midnight-ntwrk/wallet-sdk-hd';
import type { SigningKey } from '@midnight-ntwrk/compact-runtime';

async function deriveSigningKeyFromSeed(seed: string): Promise<SigningKey> {
  // Derive signing key from seed using HD wallet
  const fromMnemonic = HDWallet.fromSeed(new TextEncoder().encode(seed));
  if (fromMnemonic.type === 'seedError') {
    throw new Error(`Failed to derive HD wallet from seed: ${fromMnemonic.error}`);
  }
  
  // Get the signing key (role 3 = Zswap role for signing)
  const accountKey = fromMnemonic.hdWallet.selectAccount(0);
  const zswapRole = accountKey.selectRole(3); // Zswap role
  
  const derivationResult = zswapRole.deriveKeyAt(0);
  if (derivationResult.type === 'keyOutOfBounds') {
    throw new Error('Derivation index out of bounds');
  }
  
  // The signing key is the secret key (32 bytes)
  return derivationResult.key;
}

async function main(): Promise<void> {
  const { network, config } = resolveNetwork(process.argv);
  console.log(`Deploying ZK-Scholar to network: ${network}`);
  
  console.log('\n=== Deployment Configuration ===');
  console.log(`Network: ${network}`);
  console.log(`RPC Endpoint: ${config.node}`);
  console.log(`Indexer: ${config.indexer}`);
  console.log(`Proof Server: ${config.proofServer}`);

  // Deployment requires an explicit seed - no default/demo seeds allowed
  const seed = process.env.ZK_SCHOLAR_SEED;
  if (!seed) {
    console.error('\n❌ ZK_SCHOLAR_SEED environment variable is required for deployment.');
    console.error('Please provide a seed phrase to derive the deployment address.\n');
    console.error('Example:');
    console.error('  ZK_SCHOLAR_SEED="your-wallet-mnemonic-phrase" npm run deploy -- --network preview\n');
    process.exit(1);
  }

  console.log('\n=== Loading Compiled Contract ===');
  const { compiledContract } = await loadCompiledContract();

  // Derive signing key from seed
  console.log('\n=== Deriving Signing Key from Seed ===');
  const signingKey = await deriveSigningKeyFromSeed(seed);
  console.log('🔐 Signing key derived successfully from seed');
  
  console.log('\n=== Creating Providers ===');
  const providers = await createProviders(config);
  console.log('✓ Public Data Provider: Created');
  console.log('✓ Private State Provider: Created');
  console.log('✓ Proof Provider: Created');
  console.log('✓ ZK Config Provider: Created');

  const constructorArgs = [
    70n as bigint,    // minScore
    500000n as bigint, // maxIncome (in cents, so 500000 = $5,000)
    18n as bigint,    // minAge
  ];
  
  console.log('\n=== Contract Constructor Arguments ===');
  console.log(`minScore: ${constructorArgs[0]}`);
  console.log(`maxIncome: ${constructorArgs[1]}`);
  console.log(`minAge: ${constructorArgs[2]}`);

  console.log('\n=== Submitting Deployment Transaction ===');
  console.log('This will submit a transaction to the Midnight Preview network.');
  console.log('Ensure your wallet has tDUST for gas fees.');
  console.log('');

  try {
    // Deploy the contract using the SDK's deployContract function
    // The ZKScholarVerifier contract has no private state (Witnesses = {})
    const deployedContract = await deployContract(providers, {
      compiledContract,
      args: constructorArgs,
      signingKey,
    });

    console.log('\n✅ Deployment Successful!');
    console.log(`\n=== Deployed Contract Address ===`);
    console.log(`📍 ${deployedContract.contractAddress}\n`);
    
    console.log('=== Transaction Details ===');
    console.log(`Transaction Hash: ${deployedContract.deployTxData.txId}`);
    console.log(`Block Height: ${deployedContract.deployTxData.blockHeight}`);
    
    console.log('\n=== Next Steps ===');
    console.log('1. Update .env.local with the contract address:');
    console.log(`   VITE_CONTRACT_ADDRESS=${deployedContract.contractAddress}`);
    console.log('\n2. Update wallet configuration to connect to this contract');
    console.log('\n3. Test the contract functions via the SDK');
    
  } catch (error) {
    console.error('\n❌ Deployment failed:');
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
      console.error(`Stack: ${error.stack}`);
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Deploy failed:', err);
  process.exit(1);
});
