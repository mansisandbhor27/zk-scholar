# ZK-Scholar (Privacy-preserving Scholarship Eligibility)

This project is a privacy-first scaffold demonstrating a Midnight Compact contract, a React frontend, and a minimal backend scaffold. Client-side proof generation is simulated locally (no raw sensitive inputs leave the browser).

Quick start (development)

Prerequisites:
- Node.js (>=18) and npm
- WSL recommended on Windows for compiling Compact contracts

1) Install dependencies

```bash
npm install
cd frontend
npm install
cd ..
```

2) Start backend

```bash
# runs minimal privacy-only backend on http://localhost:3000
npm run server
```

3) Start frontend (development)

```bash
cd frontend
npm run dev
# open the Vite URL (usually http://localhost:5173)
```

Notes:
- The frontend proxies `/api` to `http://localhost:3000` in development.
- The client generates a local proof (SHA-256 hash + random salt) and sends only the hash and public signals to the backend. Raw sensitive inputs are never transmitted.
- The backend currently saves incoming proofs to `server/proofs/` and does not perform verification.

Compile contract (optional)

If you want to compile the Compact contract to produce `managed/` artifacts (used for server-side verification later), run:

```bash
# in project root
npm run compile
```

If the Compact compiler produces language-version errors, ensure you're running inside WSL with the managed compactc binary available via `@midnight-ntwrk/midnight-js-compact`.

Production

Build the frontend:

```bash
cd frontend
npm run build
```

Serve the built site with any static server and run the backend separately for `/api` endpoints.

Privacy

All privacy design choices are intentional: the browser generates proofs locally and only sends non-sensitive proof artifacts to the server. Do not change this unless you intentionally accept server-side witness handling.# ZK-Scholar: Privacy-Preserving Scholarship Eligibility Verification Using Zero-Knowledge Proofs

ZK-Scholar is a privacy-preserving scholarship eligibility verification platform built using Midnight Network and Zero-Knowledge Proofs (ZKPs).

## Project Vision
ZK-Scholar lets students prove they meet scholarship eligibility criteria without revealing exact marks, income, or birthdate. Midnight Network and Compact ensure the verification logic and proof generation happen with strong privacy guarantees, keeping sensitive data off-chain while only publishing eligibility outcomes.

## Smart Contract Deployment
- **Network:** Preview
- **Deployed contract ID:** [PENDING — run: npm run deploy -- --network preview]

## Key Features
- Private proof of eligibility thresholds: score ≥ 70%, income < ₹5,00,000, age ≥ 18
- Public contract state stores only program criteria and claim count
- User inputs are used as private witnesses and never rendered, logged, or persisted
- Frontend connects to Midnight Preview via wallet adapter and reads public state from the indexer

## Future Scope
- Add multiple scholarship programs and per-program proofs
- Implement user identity commitments and replay protection
- Support Preview-to-Mainnet migration with audited Compact contracts

## Tech Stack
- Midnight Network Compact smart contract
- React + Vite + TypeScript frontend
- WSL-based build support for Midnight contract toolchain

## Local Development
1. `npm install`
2. `cd frontend && npm install`
3. `npm run compile`
4. `npm run test`
5. `npm run frontend:build`
