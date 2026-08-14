import React, { useEffect, useState } from 'react';
import { Award, Shield, Settings, Send, RefreshCw, AlertCircle, CheckCircle, Users, BarChart3, ArrowLeft, Loader2 } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { useContractDeployment } from '../hooks/useContractDeployment';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { ledger } from '../../managed/contract/index';
import type { ContractAddress } from '@midnight-ntwrk/midnight-js-protocol/compact-runtime';
const indexerUrl = "https://indexer.preview.midnight.network";
const INDEXER_URL = "https://indexer.preview.midnight.network/api/v4/graphql";
const INDEXER_WS_URL = "wss://indexer.preview.midnight.network/api/v4/graphql";

const publicDataProvider = indexerPublicDataProvider(
  INDEXER_URL,
  INDEXER_WS_URL
);

const LOCAL_STORAGE_KEY = 'zk-scholar-contract-address';
const ENV_CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '';

interface ProgramState {
  minScore: bigint;
  maxIncome: bigint;
  minAge: bigint;
  claimCount: bigint;
  programCreated: boolean;
}

export default function AdminPanel() {
  const [programState, setProgramState] = useState<ProgramState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [contractAddress, setContractAddress] = useState<string | null>(null);

  // Use wallet and deployment hooks
  const { connectedAPI, address, isConnected, error: walletError } = useWallet();
  const { isDeploying, deploy, error: deploymentError } = useContractDeployment();

  // Merge errors
  const displayError = deploymentError || walletError || error;

  // Load contract address from localStorage or env
  useEffect(() => {
    const savedAddress = localStorage.getItem(LOCAL_STORAGE_KEY);
    setContractAddress(savedAddress || ENV_CONTRACT_ADDRESS || null);
  }, []);

  useEffect(() => {
    if (contractAddress) {
      fetchState();
    }
  }, [contractAddress]);

  
 const fetchState = async () => {
  setLoading(true);
  setError(null);

  if (
    !contractAddress ||
    contractAddress === 'REPLACE_WITH_DEPLOYED_ADDRESS'
  ) {
    setError('Contract address not configured.');
    setLoading(false);
    return;
  }

  try {
    console.log('Reading contract state:', contractAddress);

    const contractState =
  await publicDataProvider.watchForContractState(
    contractAddress as ContractAddress
  );

console.log('✓ Contract state received:', contractState);

    console.log('✓ Contract state received:', contractState);

    const contractLedger = ledger(contractState.data);

    console.log('✓ Contract ledger:', contractLedger);

    setProgramState({
      minScore: contractLedger.minScore,
      maxIncome: contractLedger.maxIncome,
      minAge: contractLedger.minAge,
      claimCount: contractLedger.claimCount,
      programCreated: contractLedger.programCreated,
    });
  } catch (err: any) {
    console.error('Failed to read contract state:', err);
    setError(
      err?.message || 'Unable to read contract state from Midnight indexer.'
    );
  } finally {
    setLoading(false);
  }
};

  // Handle real contract deployment
  const handleDeployContract = async () => {
    if (!connectedAPI) {
      console.error('No connected API available');
      return;
    }

    console.log('=== Initiating REAL contract deployment ===');
    const result = await deploy(connectedAPI, 'preview');
    
    if (result.success) {
      console.log('=== Deployment successful! ===');
      console.log('Contract address:', result.address);
      console.log('Transaction ID:', result.transactionId);
      setContractAddress(result.address!);
      
      // Update localStorage
      localStorage.setItem(LOCAL_STORAGE_KEY, result.address!);
      
      // Refresh state with new contract address
      setTimeout(() => fetchState(), 1000);
    }
  };

  // Check both localStorage address and env variable
  const isConfigured = contractAddress 
    && contractAddress !== 'REPLACE_WITH_DEPLOYED_ADDRESS'
   
  return (
    <section className="py-8">
      <div className="glass p-6 rounded-xl mb-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Shield className="text-[var(--cyan-glow)]" />
          Contract Management
        </h2>
        
        <div className="space-y-4">
          {/* Wallet Status Display */}
          <div className="mt-4 p-4 bg-yellow-900/20 rounded-lg mb-4">
            <div className="text-sm text-yellow-300 mb-2">
              <strong>Wallet Status:</strong> {isConnected ? 'Connected' : 'Not Connected'}
              {address && <span className="ml-2">(Address: {address.substring(0, 12)}...)</span>}
            </div>
            {walletError && (
              <div className="text-xs text-red-400">Error: {walletError}</div>
            )}
          </div>
          
          {/* Contract Status */}
          {isConfigured ? (
            <>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-12 w-12 border-4 border-[var(--cyan-glow)] border-transparent rounded-full mb-4"></div>
                  <h3 className="text-xl font-semibold mb-2">Loading Contract</h3>
                  <p className="text-gray-400">Fetching program state from indexer...</p>
                </div>
              ) : displayError ? (
                <div className="text-center py-8 text-red-400">{displayError}</div>
              ) : (
                <div className="glass p-6 rounded-xl mb-8">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="text-[var(--cyan-glow)]" />
                    Program Metrics
                  </h3>
                  
                  {programState && programState.programCreated ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-white/5 p-4 rounded-lg">
                        <div className="text-xs text-gray-400">Total Claims</div>
                        <div className="text-2xl font-bold">{programState.claimCount.toString()}</div>
                      </div>
                      <div className="bg-white/5 p-4 rounded-lg">
                        <div className="text-xs text-gray-400">Min Score</div>
                        <div className="text-2xl font-bold">{programState.minScore > 0n ? `${programState.minScore}%` : '0%'}</div>
                      </div>
                      <div className="bg-white/5 p-4 rounded-lg">
                        <div className="text-xs text-gray-400">Max Income</div>
                        <div className="text-2xl font-bold">₹{programState.maxIncome > 0n ? (Number(programState.maxIncome) / 100000).toFixed(0) + 'L' : '0'}</div>
                      </div>
                      <div className="bg-white/5 p-4 rounded-lg">
                        <div className="text-xs text-gray-400">Min Age</div>
                        <div className="text-2xl font-bold">{programState.minAge > 0n ? `${programState.minAge}` : '0'}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Shield className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                      <p className="text-gray-400">Configure program first to see metrics</p>
                    </div>
                  )}
                </div>
              )}
              
              <div className="glass p-6 rounded-xl mb-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Settings className="text-[var(--cyan-glow)]" />
                  Program Thresholds
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-md">
                      <BarChart3 size={20} className="text-[var(--cyan-glow)]" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Min Score Threshold</div>
                      <div className="text-2xl font-bold">{programState?.minScore > 0n ? `${programState.minScore}%` : '--'}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">Minimum academic score required</div>
                </div>

                <div className="glass p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white/5 rounded-md">
                      <Users size={20} className="text-[var(--cyan-glow)]" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Max Income</div>
                      <div className="text-2xl font-bold">₹{programState?.maxIncome > 0n ? (Number(programState.maxIncome) / 100000).toFixed(0) + 'L' : '--'}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">Maximum family income threshold</div>
                </div>

                <div className="glass p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white/5 rounded-md">
                      <ArrowLeft size={20} className="text-[var(--cyan-glow)]" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Min Age</div>
                      <div className="text-2xl font-bold">{programState?.minAge > 0n ? `${programState.minAge} years` : 'Not set'}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">Minimum age requirement</div>
                </div>
              </div>

              <div className="glass p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4">Program Details</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-400">Program Status</div>
                    <div className="font-medium">
                      {programState && programState.minScore > 0n && programState.maxIncome > 0n && programState.minAge > 0n
                        ? `Score: ${programState.minScore}% | Income: max ₹${programState.maxIncome} | Age: ${programState.minAge}+`
                        : 'Configure in Settings'}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="glass p-6 rounded-xl mb-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Shield className="text-[var(--cyan-glow)]" />
                Contract Status
              </h3>
              
              <div className="text-center py-8">
                <AlertCircle className="mx-auto h-12 w-12 text-orange-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Contract Not Configured</h3>
                <p className="text-gray-400 mb-4">
                  Connect your wallet and deploy the contract to get started.
                </p>
              </div>
              
              {/* Deploy Action Section */}
              <div className="mt-4 p-4 bg-blue-900/20 rounded-lg">
                {isConnected && connectedAPI ? (
                  <div className="space-y-4">
                    <button 
                      onClick={handleDeployContract}
                      disabled={isDeploying || !connectedAPI}
                      className="btn-primary px-5 py-3 rounded-full font-medium glow-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed w-full"
                    >
                      {isDeploying ? (
                        <><Loader2 className="h-4 w-4 animate-spin" />Deploying...</>
                      ) : (
                        <><Send className="h-4 w-4" />Deploy REAL Contract</>
                      )}
                    </button>
                    
                    {deploymentError && (
                      <div className="text-sm text-red-400 bg-red-900/20 p-3 rounded-lg">
                        {deploymentError}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <p className="text-yellow-300 text-sm mb-2">Connect your wallet in the header above to deploy.</p>
                    <p className="text-gray-400 text-xs">Please enable the 1AM Wallet extension and connect to Midnight Preview.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="glass p-6 rounded-xl">
              <h3 className="font-semibold mb-4">Program Status</h3>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-12 w-12 border-4 border-[var(--cyan-glow)] border-transparent rounded-full mb-4"></div>
                  <h3 className="text-xl font-semibold mb-2">Loading Dashboard</h3>
                  <p className="text-gray-400">Fetching program state from indexer...</p>
                </div>
              ) : displayError ? (
                <div className="text-center py-8 text-red-400">{displayError}</div>
              ) : programState ? (
                <>
                  <div className="glass p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-green-900/20 rounded-md">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Status</div>
                        <div className="text-lg font-medium text-green-400">Active</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">Program is live and accepting applications</div>
                  </div>

                  <div className="glass p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-white/5 rounded-md">
                        <Award className="h-4 w-4 text-[var(--cyan-glow)]" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Total Claims</div>
                        <div className="text-2xl font-bold">{programState.claimCount.toString()}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">Total scholarship applications processed</div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Shield className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                  <p className="text-gray-400">Configure program first to see metrics</p>
                </div>
              )}
            </div>

            <div className="glass p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">Program Thresholds</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-md">
                    <BarChart3 size={20} className="text-[var(--cyan-glow)]" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Min Score Threshold</div>
                    <div className="text-2xl font-bold">{programState?.minScore > 0n ? `${programState.minScore}%` : '--'}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">Minimum academic score required</div>
              </div>

              <div className="glass p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/5 rounded-md">
                    <Users size={20} className="text-[var(--cyan-glow)]" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Max Income</div>
                    <div className="text-2xl font-bold">₹{programState?.maxIncome > 0n ? (Number(programState.maxIncome) / 100000).toFixed(0) + 'L' : '--'}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">Maximum family income threshold</div>
              </div>

              <div className="glass p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/5 rounded-md">
                    <ArrowLeft size={20} className="text-[var(--cyan-glow)]" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Min Age</div>
                    <div className="text-2xl font-bold">{programState?.minAge > 0n ? `${programState.minAge} years` : 'Not set'}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">Minimum age requirement</div>
              </div>
            </div>

            <div className="glass p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">Program Details</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-400">Program Status</div>
                  <div className="font-medium">
                    {programState && programState.minScore > 0n && programState.maxIncome > 0n && programState.minAge > 0n
                      ? `Score: ${programState.minScore}% | Income: max ₹${programState.maxIncome} | Age: ${programState.minAge}+`
                      : 'Configure in Settings'}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass p-6 rounded-xl">
            <h4 className="text-lg font-semibold mb-3">Contract Information</h4>
            <div className="text-sm text-gray-400 space-y-2">
              <div className="flex justify-between">
                <span>Contract ID:</span>
                <code className="bg-white/5 px-2 py-1 rounded break-all">{contractAddress || 'Not set'}</code>
              </div>
              <div className="flex justify-between">
                <span>Network:</span>
                <code>Midnight Preview</code>
              </div>
              <div className="flex justify-between">
                <span>Index API:</span>
                <code className="text-[var(--cyan-glow)]">Midnight Preview Indexer</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
