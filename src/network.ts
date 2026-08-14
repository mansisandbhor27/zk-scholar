import fs from 'fs';
import path from 'path';

export function getPreviewUrl() {
  return process.env.PREVIEW_NETWORK_URL || 'https://preview.midnight.network';
}

export function getIndexerUrl() {
  return process.env.INDEXER_URL || 'https://indexer.preview.midnight.network';
}

export function readContractAddress() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return undefined;
  const contents = fs.readFileSync(envPath, 'utf-8');
  const match = contents.match(/VITE_CONTRACT_ADDRESS=(.+)/);
  return match?.[1]?.trim();
}
