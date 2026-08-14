export function assertPreviewNetwork(name: string) {
  if (name !== 'preview') {
    throw new Error(`Expected preview network, got ${name}`);
  }
}
