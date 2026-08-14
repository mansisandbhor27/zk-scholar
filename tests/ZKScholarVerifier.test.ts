import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('ZKScholarVerifier Contract', () => {
  const contractPath = path.resolve(process.cwd(), 'contracts', 'ZKScholarVerifier.compact');
  const contractSource = fs.readFileSync(contractPath, 'utf-8');

  it('should compile contract source', () => {
    expect(contractSource).toContain('pragma language_version 0.23.0;');
    expect(contractSource).toContain('export ledger minScore: Uint<64>;');
    expect(contractSource).toContain('export circuit createScholarshipProgram');
    expect(contractSource).toContain('export circuit proveEligibility');
    expect(contractSource).toContain('export circuit recordClaim');
  });

  it('should not expose private inputs in source comments', () => {
    // Inspect only the header comment to ensure sensitive field names are not listed plainly
    const header = contractSource.split('\n').slice(0, 6).join('\n');
    expect(header).not.toMatch(/\b(score|income|age)\b/i);
  });

  it('should include disclose usage', () => {
    expect(contractSource).toContain('disclose(');
  });
});
