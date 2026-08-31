const DEFAULT_INDEXER_BASE = 'https://api-preview.1am.xyz';

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
 * Derives the matching GraphQL WebSocket endpoint
 * (wss://<base>/api/v4/graphql/ws) from an HTTP(S) endpoint. The subscriptions
 * endpoint sits under the `/ws` suffix, distinct from the HTTP query URL.
 */
function toWsGraphQL(endpoint: string): string {
  const trimmed = (endpoint || DEFAULT_INDEXER_BASE).trim().replace(/\/+$/, '');
  const wsPath = trimmed.endsWith('/api/v4/graphql/ws')
    ? trimmed
    : trimmed.endsWith('/api/v4/graphql')
      ? `${trimmed}/ws`
      : `${trimmed}/api/v4/graphql/ws`;
  return wsPath.replace(/^https:/i, 'wss:').replace(/^http:/i, 'ws:');
}

export const INDEXER_URL = toHttpGraphQL(import.meta.env.VITE_INDEXER_URL);

export const INDEXER_WS_URL = toWsGraphQL(
  import.meta.env.VITE_INDEXER_WS_URL || import.meta.env.VITE_INDEXER_URL
);
