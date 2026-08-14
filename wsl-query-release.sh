#!/usr/bin/env bash
cd /mnt/c/Users/User/Desktop/zk-scholar
node - <<'NODE'
const url = 'https://api.github.com/repos/midnightntwrk/compact/releases';
(async () => {
  const res = await fetch(url, { headers: { 'User-Agent': 'node' } });
  console.log(res.status);
  const data = await res.json();
  data.slice(0,10).forEach(r => console.log(r.tag_name));
})();
NODE
