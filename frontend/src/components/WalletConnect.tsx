import React, { useEffect, useState } from 'react';
import { Wallet, Check, X } from 'lucide-react';

const network = import.meta.env.VITE_NETWORK || 'preview';

export default function WalletConnect() {
  const [wallet, setWallet] = useState<any>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [networkName, setNetworkName] = useState<string | null>(null);

  useEffect(() => {
    const midnightWallets = Object.values(window as any).filter((value: any) => {
      return value && typeof value === 'object' && value.midnight && typeof value.request === 'function';
    });

    if (midnightWallets.length > 0) {
      setWallet(midnightWallets[0]);
    }
  }, []);

  const connect = async () => {
    setError(null);
    if (!wallet) {
      setError('Midnight wallet not installed.');
      return;
    }

    try {
      const connection = await wallet.request({ method: 'midnight_connect', params: [{ network }] });
      setAddress(connection.address);
      setNetworkName(connection.network);

      if (connection.network !== network) {
        setError(`Connected wallet network mismatch. Expected ${network}.`);
      }
    } catch (err) {
      setError('Wallet connection rejected or failed.');
    }
  };

  const disconnect = async () => {
    setAddress(null);
    setNetworkName(null);
    setError(null);
    if (wallet?.request) {
      try {
        await wallet.request({ method: 'midnight_disconnect' });
      } catch {
        // ignore
      }
    }
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
            <div className="flex items-center gap-2">
              {address ? <Check color="#06b6d4" /> : <X color="#fb923c" />}
              <div className="text-sm">{address ? 'Wallet Connected' : 'Not Connected'}</div>
            </div>
            <button onClick={address ? disconnect : connect} className="btn-primary px-4 py-2 rounded-md text-sm shadow-sm hover:opacity-90 transition">
              {address ? 'Disconnect' : 'Connect Wallet'}
            </button>
          </>
        ) : (
          <div className="text-sm text-orange-300">No Midnight wallet detected</div>
        )}
      </div>
    </div>
  );
}
