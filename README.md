# ZK-Scholar

## Privacy-Preserving Scholarship Eligibility Verification

ZK-Scholar is a privacy-preserving scholarship eligibility verification dApp built on the **Midnight Network** using the **Compact** smart contract language, Zero-Knowledge Proofs, React, and TypeScript.

The application allows a student to prove that they satisfy scholarship eligibility criteria without publicly revealing their exact private inputs.

## How It Works

The user provides private eligibility information such as:

- Academic score
- Family income
- Age / date of birth

The Midnight Compact contract verifies the eligibility conditions through a zero-knowledge circuit.

The application publishes the verification result and maintains the public claim count without exposing the user's private eligibility values.

## Smart Contract

- **Contract:** `ZKScholarVerifier`
- **Network:** Midnight Preview
- **Contract address:** Configured dynamically after deployment
- **Current development deployment:** `80de69708ee587e56690a1b1b12a65d850939c59f4307aa82f7ca9de217b6493`

> The contract address is stored in browser localStorage after a successful deployment, allowing the frontend to use the newly deployed contract.

## Key Features

- Zero-knowledge scholarship eligibility verification
- Private eligibility inputs
- Midnight Compact smart contract
- 1AM Wallet integration
- Midnight Preview network support
- On-chain scholarship claim counter
- Contract state dashboard
- Program configuration interface
- Claims dashboard
- Transaction status and proof submission feedback
- React + Vite frontend

## Smart Contract Logic

The `ZKScholarVerifier` contract maintains:

- Minimum academic score
- Maximum family income
- Minimum age
- Total verified claim count
- Program creation status

The eligibility circuit checks:

```text
score >= minimum score
income < maximum income
age >= minimum age
