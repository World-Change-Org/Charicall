# Charicall EVM contracts

Solidity contracts for on-chain donation tracking, built with [Foundry](https://book.getfoundry.sh/).

## Contracts

- **`CharicallDonation`** — Per-cause targets and raised totals in wei. Emits **`CauseClosed`** the first time a cause’s cumulative donations meet or exceed its target.
- Anonymous donations persist a `DonationRecord` with `donor = address(0)` so on-chain storage does not reveal the donor wallet.

## Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation) (`forge`, `cast`)

## Setup

From this directory:

```bash
git submodule update --init --recursive
forge build
```

## Tests

```bash
forge test
```

Coverage in this package includes anonymous donation storage so regressions around donor redaction are caught in CI.

## Deployment (Foundry script)

Set `PRIVATE_KEY` and the RPC URL for your target network. Copy `.env.example` to `.env` and fill in values (never commit `.env`).

**Sepolia (testnet):**

```bash
source .env
forge script script/DeployCharicallDonation.s.sol:DeployCharicallDonation --rpc-url sepolia --broadcast --verify
```

**Ethereum mainnet:**

```bash
source .env
forge script script/DeployCharicallDonation.s.sol:DeployCharicallDonation --rpc-url mainnet --broadcast --verify
```

You can pass `--rpc-url $SEPOLIA_RPC_URL` (or any HTTPS URL) instead of the named endpoints. Omit `--verify` if you do not use contract verification.
