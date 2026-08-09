import React, { useState, useEffect, useContext, createContext, useCallback } from 'react';

type WalletContextType = {
  address: string | null;
  network: string;
  provider: any | null;
  connected: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
};

const WalletContext = createContext<WalletContextType | null>(null);

const network = import.meta.env.VITE_NETWORK || 'preview';

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<any | null>(null);
  const [connected, setConnected] = useState(false);

  const connect = useCallback(async () => {
    if (!provider) {
      // Use wallet connector API when available
      const dappConnector = (window as any).midnight?.dapp;
      if (dappConnector) {
        try {
          const connection = await dappConnector.connect(network);
          setAddress(connection.address);
          setProvider(connection);
          setConnected(true);
        } catch (error) {
          console.error('Connection failed:', error);
          throw error;
        }
      }
    }
  }, [provider]);

  const disconnect = useCallback(async () => {
    if (provider) {
      try {
        await provider.disconnect();
      } catch (e) {
        // ignore disconnect errors
      }
      setAddress(null);
      setConnected(false);
    }
  }, [provider]);

  useEffect(() => {
    // Check for existing wallet connection
    const checkConnection = async () => {
      const dappConnector = (window as any).midnight?.dapp;
      if (dappConnector && dappConnector.address) {
        setAddress(dappConnector.address);
        setConnected(true);
      }
    };
    checkConnection();
  }, []);

  return React.createElement(
    WalletContext.Provider,
    { value: { address, network, provider, connected, connect, disconnect } },
    children
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}