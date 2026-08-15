# 🎓 ZK-Scholar

## Privacy-Preserving Scholarship Eligibility Verification on Midnight

ZK-Scholar is a privacy-preserving scholarship eligibility verification dApp built on the **Midnight Network** using **Compact smart contracts, Zero-Knowledge Proofs, React, and TypeScript**.

The project demonstrates how students can prove scholarship eligibility without exposing sensitive eligibility information as public blockchain data.

---

## 🏆 Project Highlights

| Feature | Status |
|---|---|
| Midnight Compact Smart Contract | ✅ Implemented |
| Midnight Preview Network | ✅ Deployed |
| Wallet Integration | ✅ Implemented |
| Zero-Knowledge Eligibility Verification | ✅ Implemented |
| On-chain Claim Recording | ✅ Implemented |
| On-chain Claim Counter | ✅ Implemented |
| Program Configuration | ✅ Implemented |
| Contract State via Midnight Indexer | ✅ Implemented |
| Dashboard | ✅ Implemented |
| Claims Dashboard | ✅ Implemented |
| Dynamic Contract Address | ✅ Implemented |
| TypeScript Build | ✅ Passed |
### 🚀 Deployed Smart Contract

The ZK-Scholar Compact smart contract is deployed on the **Midnight Preview Network**.

| Detail | Value |
|---|---|
| Network | Midnight Preview |
| Contract Address | `80de69708ee587e56690a1b1b12a65d850939c59f4307aa82f7ca9de217b6493` |
| Contract Language | Compact |
| State Access | Midnight Indexer |
| Wallet | Midnight Preview Wallet |

The deployed contract is used by the application to:

- Read scholarship program thresholds
- Read the on-chain claim count
- Verify eligibility proofs
- Record verified scholarship claims

**Contract Address:**

```text
80de69708ee587e56690a1b1b12a65d850939c59f4307aa82f7ca9de217b6493
```

## 🔄 Verification Flow

The ZK-Scholar verification flow connects the React frontend, Midnight wallet, Compact smart contract, and Midnight Indexer.

### 1. Scholarship Program Configuration

The administrator creates the scholarship program using `createScholarshipProgram`, providing the minimum score, maximum income, and minimum age thresholds.

### 2. Student Connects Wallet

The student connects the Midnight Preview wallet to authorize contract transactions.

### 3. Eligibility Verification

The frontend calls `proveEligibility(score, income, age)`. The Compact contract checks:

```text
score >= minScore
income < maxIncome
age >= minAge
```

If all conditions pass, eligibility verification succeeds.

### 4. Claim Recording

After successful verification, the frontend calls `recordClaim()`. The contract increments the on-chain `claimCount`.

### 5. Public State and Dashboard

The frontend reads the public contract state through the Midnight Indexer. The Claims Dashboard displays the verified claim count and scholarship program state.

---

# 🔐 Privacy Model

ZK-Scholar is designed to verify scholarship eligibility while minimizing exposure of sensitive student information.

### Private Eligibility Information

The following information is used as eligibility input:

```text
Academic Score
Family Income
Age
