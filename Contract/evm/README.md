# Charicall EVM contracts

Solidity contracts for on-chain donation tracking, built with [Foundry](https://book.getfoundry.sh/).

## Contracts

- **`CharicallDonation`** — Per-cause targets and raised totals in wei. Emits **`CauseClosed`** the first time a cause’s cumulative donations meet or exceed its target.

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
