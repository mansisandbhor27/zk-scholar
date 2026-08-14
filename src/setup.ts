import { spawnSync } from 'node:child_process';
import { resolveNetwork } from './network';

function run(cmd: string, args: string[]): void {
  const result = spawnSync(cmd, args, { stdio: 'inherit' });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

async function main(): Promise<void> {
  const { network, config } = resolveNetwork(process.argv);
  console.log(`Setting up ZK-Scholar on ${network}`);
  if (network === 'undeployed') {
    run('docker', ['compose', 'up', '-d', '--wait', ...config.composeServices]);
  }
  run('npm', ['run', 'compile']);
  run('npm', ['run', 'deploy', '--', '--network', network]);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
