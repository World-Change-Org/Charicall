// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {CharicallDonation} from "../src/CharicallDonation.sol";

/// @title DeployCharicallDonation
/// @notice Foundry script to deploy `CharicallDonation` to any EVM chain (testnet or mainnet).
contract DeployCharicallDonation is Script {
    /// @dev Uses `PRIVATE_KEY` from the environment for `vm.startBroadcast`.
    function run() external returns (CharicallDonation deployed) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        deployed = new CharicallDonation();
        vm.stopBroadcast();
        console2.log("CharicallDonation:", address(deployed));
    }
}
