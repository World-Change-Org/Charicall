// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, Vm} from "forge-std/Test.sol";
import {CharicallDonation} from "../src/CharicallDonation.sol";

contract CharicallDonationTest is Test {
    CharicallDonation internal donation;
    address internal owner = address(0xA11CE);
    address internal donor = address(0xD00d);

    uint256 internal constant CAUSE_ID = 1;
    uint256 internal constant TARGET = 1 ether;

    event Donation(uint256 indexed causeId, address indexed donor, uint256 amount, uint256 newTotalRaised);
    event CauseClosed(uint256 indexed causeId, uint256 totalRaised, uint256 targetAmount);

    function setUp() public {
        vm.prank(owner);
        donation = new CharicallDonation();
        vm.prank(owner);
        donation.createCause(CAUSE_ID, TARGET);
    }

    function test_emitsCauseClosed_whenTotalMeetsTarget() public {
        vm.deal(donor, TARGET);

        vm.expectEmit(true, true, true, true);
        emit CauseClosed(CAUSE_ID, TARGET, TARGET);

        vm.prank(donor);
        donation.donate{value: TARGET}(CAUSE_ID);
    }

    function test_emitsCauseClosed_whenTotalExceedsTargetInOneDonation() public {
        uint256 over = TARGET + 0.5 ether;
        vm.deal(donor, over);

        vm.expectEmit(true, true, true, true);
        emit CauseClosed(CAUSE_ID, over, TARGET);

        vm.prank(donor);
        donation.donate{value: over}(CAUSE_ID);
    }

    function test_emitsCauseClosed_onlyOnce_afterGoalReached() public {
        vm.deal(donor, 10 ether);

        vm.prank(donor);
        donation.donate{value: TARGET}(CAUSE_ID);

        vm.recordLogs();
        vm.prank(donor);
        donation.donate{value: 0.1 ether}(CAUSE_ID);
        Vm.Log[] memory logs = vm.getRecordedLogs();
        bytes32 causeClosedSig = keccak256("CauseClosed(uint256,uint256,uint256)");

        for (uint256 i = 0; i < logs.length; i++) {
            assertFalse(logs[i].topics[0] == causeClosedSig, "CauseClosed must not fire twice");
        }
    }

    function test_partialDonations_thenCauseClosed() public {
        vm.deal(donor, TARGET);

        vm.prank(donor);
        donation.donate{value: TARGET / 2}(CAUSE_ID);

        vm.expectEmit(true, true, true, true);
        emit CauseClosed(CAUSE_ID, TARGET, TARGET);

        vm.prank(donor);
        donation.donate{value: TARGET / 2}(CAUSE_ID);
    }
}
