// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {DeployCharicallDonation} from "../script/DeployCharicallDonation.s.sol";
import {CharicallDonation} from "../src/CharicallDonation.sol";

contract DeployCharicallDonationTest is Test {
    function test_deployScript_deploysCharicallDonation() public {
        string memory pkHex =
            "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
        vm.setEnv("PRIVATE_KEY", pkHex);
        uint256 deployerPk = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;

        DeployCharicallDonation script = new DeployCharicallDonation();
        CharicallDonation deployed = script.run();

        assertEq(deployed.owner(), vm.addr(deployerPk));
    }
}
