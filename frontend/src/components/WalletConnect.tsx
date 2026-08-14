import React from 'react';
import { Wallet, Check, X } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';

const network = import.meta.env.VITE_NETWORK || 'preview';

export default function WalletConnect() {
  const { connectedAPI, wallet, address, error: walletError, connect, disconnect, isConnected } = useWallet();
  const [localError, setLocalError] = React.useState<string | null>(null);
  const error = walletError || localError;

  const refreshDetection = () => {
    // This will be handled by the useWallet hook in the browser
    window.dispatchEvent(new Event('wallet-detect-refresh'));
  };

  return (
    <div className="glass p-4 rounded-lg flex items-center justify-between">
      <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-md bg-gradient-to-br from-[var(--accent-start)] to-[var(--accent-end)] flex items-center justify-center text-white"> 
          <Wallet size={20} />
        </div>
        <div>
          <div className="text-sm text-gray-300 font-medium">Wallet Connection</div>
          <div className="text-xs text-gray-400">Network: <strong className="text-white">{network}</strong></div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {wallet ? (
          <>
            {connectedAPI ? (
              <>
                <div className="flex items-center gap-2">
                  <Check color="#06b6d4" />
                  <div className="text-sm">Connected: {address?.substring(0, 8)}...</div>
                </div>
                <button onClick={disconnect} className="btn-primary px-4 py-2 rounded-md text-sm shadow-sm hover:opacity-90 transition">
                  Disconnect
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Check color="#06b6d4" />
                  <div className="text-sm">Wallet Found: {(wallet as any).name || 'Midnight Wallet'}</div>
                </div>
                <button onClick={connect} className="btn-primary px-4 py-2 rounded-md text-sm shadow-sm hover:opacity-90 transition">
                  Connect Wallet
                </button>
              </>
            )}
          </>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <X color="#fb923c" />
              <span className="text-sm text-orange-300">No Midnight wallet detected</span>
            </div>
            <button onClick={refreshDetection} className="text-xs text-gray-400 hover:text-white underline">
              Retry detection
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
