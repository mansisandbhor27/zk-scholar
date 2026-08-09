import * as crypto from 'node:crypto';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { CompiledContract } from '@midnight-ntwrk/midnight-js-protocol/compact-js';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';

import type { NetworkConfig } from './network';

// Path to compiled contract artifacts (relative to project root)
// Compiled via: compact compile contracts/ZKScholarVerifier.compact contracts/managed/zkScholar
export const COMPILED_CONTRACT_PATH = path.resolve(process.cwd(), 'contracts', 'managed', 'zkScholar');
export const PRIVATE_STATE_ID = 'zkScholarPrivateState';

export function ensureCompiled(): void {
  if (!fs.existsSync(path.join(COMPILED_CONTRACT_PATH, 'contract', 'index.js'))) {
    console.error('\n❌ Contract not compiled! Run: npm run compile\n');
    console.error(`Expected path: ${COMPILED_CONTRACT_PATH}/contract/index.js\n`);
    process.exit(1);
  }
}

export function adminSecret(seed: string): Uint8Array {
  return crypto.createHash('sha256').update(`zk-scholar:admin:${seed}`).digest();
}

export function applicantCommitment(secret: Uint8Array): Uint8Array {
  return crypto.createHash('sha256').update(Buffer.concat([Buffer.from('zk-scholar:applicant:'), secret])).digest();
}

export function newApplicantSecret(): Uint8Array {
  return crypto.randomBytes(32);
}

export function makeWitnesses() {
  // The ZKScholarVerifier contract has no witness requirements
  // All private inputs are handled via disclose() in circuits
  return {};
}

export async function loadCompiledContract() {
  ensureCompiled();
  const contractPath = path.join(COMPILED_CONTRACT_PATH, 'contract', 'index.js');
  const zkConfigPath = path.join(COMPILED_CONTRACT_PATH);
  const ZkScholar = await import(pathToFileURL(contractPath).href);
  const witnesses = makeWitnesses();
  const withWitnesses = CompiledContract.withWitnesses as any;
  const withAssets = CompiledContract.withCompiledFileAssets as any;
  const compiledContract = (CompiledContract.make('zkScholar', ZkScholar.Contract) as any).pipe(
    withWitnesses(witnesses),
    withAssets(zkConfigPath),
  ) as any;
  return { ZkScholar, compiledContract };
}

export async function createProviders(networkConfig: NetworkConfig) {
  const privateStatePassword = process.env.PRIVATE_STATE_PASSWORD?.trim() || 'ZKScholar-Local-Devnet-Placeholder-1';
  return {
    privateStateProvider: levelPrivateStateProvider({
      privateStateStoreName: 'zkScholar-state',
      accountId: 'zkScholar-local',
      privateStoragePasswordProvider: () => privateStatePassword,
    }),
    publicDataProvider: indexerPublicDataProvider(networkConfig.indexer, networkConfig.indexerWS),
    zkConfigProvider: new NodeZkConfigProvider(path.join(COMPILED_CONTRACT_PATH)),
    proofProvider: httpClientProofProvider(networkConfig.proofServer, new NodeZkConfigProvider(path.join(COMPILED_CONTRACT_PATH))),
  };
}
