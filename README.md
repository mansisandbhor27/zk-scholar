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

# 🔐 Privacy Model

ZK-Scholar is designed to verify scholarship eligibility while minimizing exposure of sensitive student information.

### Private Eligibility Information

The following information is used as eligibility input:

```text
Academic Score
Family Income
Age
