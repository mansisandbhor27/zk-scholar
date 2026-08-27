import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ConnectedAPI, InitialAPI } from '@midnight-ntwrk/dapp-connector-api';

const network = import.meta.env.VITE_NETWORK || 'preview';

type WalletContextType = {
  connectedAPI: ConnectedAPI | null;
  wallet: InitialAPI | null;
  address: string | null;
  networkName: string | null;
  isConnected: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
};

// Export the context so it can be imported elsewhere
const WalletContext = createContext<WalletContextType | null>(null);
export { WalletContext };

export function useWalletContext() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWalletContext must be used within WalletProvider');
  }
  return context;
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<InitialAPI | null>(null);
  const [connectedAPI, setConnectedAPI] = useState<ConnectedAPI | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [networkName, setNetworkName] = useState<string | null>(network);
  const [error, setError] = useState<string | null>(null);

  const detectWallet = useCallback(() => {
    const midnightObj = (window as any).midnight;
    console.log('Checking for wallet:', { midnightObj: !!midnightObj });
    
    if (!midnightObj || typeof midnightObj !== 'object') {
      console.log('window.midnight not found or not an object');
      setWallet(null);
      return;
    }

    let foundWallet: InitialAPI | null = null;
    
    if (typeof (midnightObj as InitialAPI).connect === 'function') {
      console.log('Found wallet at window.midnight directly');
      foundWallet = midnightObj as InitialAPI;
    } else {
      const keys = Object.keys(midnightObj);
      for (const key of keys) {
        const candidate = (midnightObj as any)[key];
        if (candidate && typeof candidate === 'object' && typeof candidate.connect === 'function') {
          console.log(`Found wallet at window.midnight.${key}`);
          foundWallet = candidate;
          break;
        }
      }
    }
    
    if (foundWallet) {
      console.log('Midnight wallet detected:', {
        name: (foundWallet as any).name || (foundWallet as any).rdns,
        rdns: (foundWallet as any).rdns,
        apiVersion: (foundWallet as any).apiVersion
      });
      setWallet(foundWallet);
      setError(null);
    } else {
      console.log('window.midnight exists but no valid InitialAPI found');
      setWallet(null);
    }
  }, []);

  useEffect(() => {
    detectWallet();
  }, [detectWallet]);

  const connect = useCallback(async () => {
    setError(null);
    
    // Always use the current state value, not closure
    const currentWallet = wallet;
    if (!currentWallet) {
      // Try to detect the wallet first
      detectWallet();
      // Wait a tick for state to update
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    const walletToUse = wallet; // Get fresh state
    if (!walletToUse) {
      setError('Midnight wallet not installed.');
      return;
    }

    try {
      console.log('Connecting to wallet for network:', network);
      const api = await walletToUse.connect(network);
      console.log('Wallet connected:', api);
      setConnectedAPI(api);
setNetworkName(network);
      
      const addresses = await api.getShieldedAddresses();
      console.log('Shielded addresses:', addresses);
      if (addresses && (addresses as any).shieldedAddress) {
        setAddress((addresses as any).shieldedAddress);
      }
      
      try {
  const config = await api.getConfiguration();
  console.log('Wallet configuration:', config);

  const actualNetwork = config.networkId || network;
  setNetworkName(actualNetwork);

  if (actualNetwork !== network) {
    setError(
      `Connected wallet network mismatch. Expected ${network}, got ${actualNetwork}.`
    );
  }
} catch (e) {
  console.warn(
    'Could not read wallet configuration, using configured network:',
    e
  );
  setNetworkName(network);
}
    } catch (err) {
      console.error('Connection error:', err);
      setError('Wallet connection rejected or failed.');
    }
  }, [wallet, detectWallet, network]);

  const disconnect = useCallback(async () => {
    setConnectedAPI(null);
    setAddress(null);
    setNetworkName(null);
    setError(null);
  }, []);

  return (
    <WalletContext.Provider value={{
      connectedAPI,
      wallet,
      address,
      networkName,
      isConnected: connectedAPI !== null,
      error,
      connect,
      disconnect,
    }}>
      {children}
    </WalletContext.Provider>
  );
}
