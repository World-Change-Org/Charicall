// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";

contract FoundryConfigTest is Test {
    function test_rpcAliasesResolveForSupportedNetworks() public {
        vm.setEnv("SEPOLIA_RPC_URL", "https://sepolia.example");
        vm.setEnv("BASE_SEPOLIA_RPC_URL", "https://base-sepolia.example");
        vm.setEnv("POLYGON_MUMBAI_RPC_URL", "https://polygon-mumbai.example");
        vm.setEnv("MAINNET_RPC_URL", "https://mainnet.example");

        assertEq(vm.rpcUrl("sepolia"), "https://sepolia.example");
        assertEq(vm.rpcUrl("base_sepolia"), "https://base-sepolia.example");
        assertEq(vm.rpcUrl("polygon_mumbai"), "https://polygon-mumbai.example");
        assertEq(vm.rpcUrl("mainnet"), "https://mainnet.example");
    }
}
