$ErrorActionPreference = "Stop"

if (-not (Test-Path ".env")) {
  throw ".env not found. Copy .env.example to .env and set PRIVATE_KEY, SEPOLIA_RPC_URL, ETHERSCAN_API_KEY."
}

Get-Content ".env" | ForEach-Object {
  if ($_ -match "^\s*#" -or $_ -match "^\s*$") { return }
  $key, $value = $_ -split "=", 2
  if ($key -and $value) {
    [System.Environment]::SetEnvironmentVariable($key.Trim(), $value.Trim(), "Process")
  }
}

forge script script/DeployCharicallDonation.s.sol:DeployCharicallDonation --rpc-url sepolia --broadcast --verify -vvvv
