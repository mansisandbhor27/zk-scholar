import * as fs from 'node:fs';
import * as path from 'node:path';
import { Buffer } from 'node:buffer';
import { setNetworkId, getNetworkId } from '@midnight-ntwrk/midnight-js/network-id';

export type NetworkId = 'undeployed' | 'preview' | 'preprod';

export interface NetworkConfig {
  networkId: NetworkId;
  indexer: string;
  indexerWS: string;
  node: string;
  proofServer: string;
  faucet: string | null;
  composeServices: string[];
}

export const NETWORK_CONFIGS: Record<NetworkId, NetworkConfig> = {
  undeployed: {
    networkId: 'undeployed',
    indexer: 'http://127.0.0.1:8088/api/v4/graphql',
    indexerWS: 'ws://127.0.0.1:8088/api/v4/graphql/ws',
    node: 'ws://127.0.0.1:9944',
    proofServer: 'http://127.0.0.1:6300',
    faucet: null,
    composeServices: ['node', 'indexer', 'proof-server'],
  },
  preview: {
    networkId: 'preview',
    indexer: 'https://indexer.preview.midnight.network/api/v4/graphql',
    indexerWS: 'wss://indexer.preview.midnight.network/api/v4/graphql/ws',
    node: 'https://rpc.preview.midnight.network',
    // For Preview network, use local proof server or configure PUBLIC_PROOF_SERVER
    proofServer: process.env.PROOF_SERVER_URL || 'http://127.0.0.1:6300',
    faucet: 'https://midnight-tmnight-preview.nethermind.dev',
    composeServices: ['proof-server'],
  },
  preprod: {
    networkId: 'preprod',
    indexer: 'https://indexer.preprod.midnight.network/api/v4/graphql',
    indexerWS: 'wss://indexer.preprod.midnight.network/api/v4/graphql/ws',
    node: 'https://rpc.preprod.midnight.network',
    proofServer: process.env.PROOF_SERVER_URL || 'http://127.0.0.1:6300',
    faucet: 'https://midnight-tmnight-preprod.nethermind.dev',
    composeServices: ['proof-server'],
  },
};

export interface ResolveResult {
  network: NetworkId;
  config: NetworkConfig;
  source: 'flag' | 'state' | 'default';
}

export function isNetworkId(value: unknown): value is NetworkId {
  return typeof value === 'string' && ['undeployed', 'preview', 'preprod'].includes(value);
}

export function parseNetworkFlag(argv: string[]): NetworkId | null {
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--network' && argv[i + 1]) return argv[i + 1] as NetworkId;
    if (argv[i].startsWith('--network=')) return argv[i].slice('--network='.length) as NetworkId;
  }
  return null;
}

export function resolveNetwork(argv: string[] = process.argv): ResolveResult {
  const flag = parseNetworkFlag(argv);
  const network: NetworkId = flag ?? 'undeployed';
  return {
    network,
    config: NETWORK_CONFIGS[network],
    source: flag ? 'flag' : 'default',
  };
}
