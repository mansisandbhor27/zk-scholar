import path from 'path';

const PREVIEW_NETWORK = 'preview';
const INDEXER_URL = 'https://indexer.preview.midnight.network/api/v4/graphql';
const INDEXER_WS_URL = 'wss://indexer.preview.midnight.network/api/v4/graphql';
const PROOF_SERVER_URL = 'https://proof.preview.midnight.network';
const ZK_CONFIG_URL = 'https://config.preview.midnight.network';

// State type for ZKScholar
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

async function main() {
  console.log('=== ZK-Scholar Contract Deployment ===\n');

  console.log('Network:', PREVIEW_NETWORK);
  console.log('Indexer URL:', INDEXER_URL);
  console.log('Proof Server:', PROOF_SERVER_URL);

  console.log('\n========================================');
  console.log('BROWSER-BASED DEPLOYMENT');
  console.log('========================================\n');
  console.log('For browser-based deployment with 1AM Wallet:');
  console.log('  1. Run: npm run frontend:dev');
  console.log('  2. Open http://localhost:5173 in your browser');
  console.log('  3. Install and connect the 1AM Wallet browser extension');
  console.log('  4. Connect to Midnight Preview network');
  console.log('  5. Navigate to the Admin panel and click "Deploy Contract"');
  console.log('  6. The wallet will create and submit the deployment transaction\n');

  console.log('Contract: ZKScholarVerifier');
  console.log('Initial State:', INITIAL_PRIVATE_STATE);
  console.log('\nThe deployment uses the connected 1AM Wallet to:');
  console.log('  - Create an UnboundTransaction for the contract deployment');
  console.log('  - Balance the transaction using the wallet (balanceTx)');
  console.log('  - Submit the finalized transaction via the wallet (submitTx)');
  console.log('  - Return the real deployed contract address\n');

  console.log('Expected contract address format: 35-byte hex string (mn://contract address)');
  console.log('This will be saved to localStorage and displayed in the Admin Panel.\n');
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
