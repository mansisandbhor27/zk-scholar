const DEFAULT_INDEXER_BASE = 'https://indexer.preview.midnight.network';

/**
 * Normalizes an indexer endpoint so the GraphQL HTTP endpoint always resolves
 * to <base>/api/v4/graphql — whether VITE_INDEXER_URL was provided as the bare
 * host (https://indexer.preview.midnight.network) or as the full GraphQL path
 * (https://indexer.preview.midnight.network/api/v4/graphql).
 */
function toHttpGraphQL(endpoint: string): string {
  const trimmed = (endpoint || DEFAULT_INDEXER_BASE).trim().replace(/\/+$/, '');
  return trimmed.endsWith('/api/v4/graphql')
    ? trimmed
    : `${trimmed}/api/v4/graphql`;
}

/**
 * Derives the matching GraphQL WebSocket endpoint (wss://<base>/api/v4/graphql)
 * from an HTTP(S) endpoint.
 */
function toWsGraphQL(endpoint: string): string {
  const httpEndpoint = toHttpGraphQL(endpoint);
  return httpEndpoint
    .replace(/^https:/i, 'wss:')
    .replace(/^http:/i, 'ws:');
}

export const INDEXER_URL = toHttpGraphQL(import.meta.env.VITE_INDEXER_URL);

export const INDEXER_WS_URL = toWsGraphQL(
  import.meta.env.VITE_INDEXER_WS_URL || import.meta.env.VITE_INDEXER_URL
);