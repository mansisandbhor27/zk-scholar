import { useContext } from 'react';
import { WalletContext } from '../contexts/WalletContext';

// This hook uses the shared WalletContext for synchronized state
export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
}
