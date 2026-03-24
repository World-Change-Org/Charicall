// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title CharicallDonation
/// @notice On-chain donation ledger for Charicall causes. Totals per cause are tracked in wei.
/// @dev `CauseClosed` fires exactly once when a cause first reaches or exceeds its funding target.
contract CharicallDonation {
    struct Cause {
        uint256 targetAmount;
        uint256 raisedAmount;
        bool goalReachedEmitted;
    }

    struct DonationRecord {
        address donor;
        uint256 amount;
        bool isAnonymous;
    }

    address public owner;

    mapping(uint256 causeId => Cause) public causes;
    mapping(uint256 causeId => DonationRecord[]) private donationRecords;

    /// @notice Emitted for every donation received for a cause.
    event Donation(
        uint256 indexed causeId, address indexed donor, uint256 amount, uint256 newTotalRaised, bool isAnonymous
    );

    /// @notice Emitted once when `raisedAmount` first meets or exceeds `targetAmount` for a cause.
    /// @param causeId The cause identifier.
    /// @param totalRaised The cumulative amount raised at the time the goal was met (may exceed target).
    /// @param targetAmount The funding goal for the cause.
    event CauseClosed(uint256 indexed causeId, uint256 totalRaised, uint256 targetAmount);

    error NotOwner();
    error ZeroTarget();
    error CauseAlreadyExists();
    error UnknownCause();
    error ZeroDonation();

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /// @notice Registers a new cause with a funding target (wei).
    function createCause(uint256 causeId, uint256 targetAmountWei) external onlyOwner {
        if (targetAmountWei == 0) revert ZeroTarget();
        Cause storage c = causes[causeId];
        if (c.targetAmount != 0) revert CauseAlreadyExists();
        c.targetAmount = targetAmountWei;
    }

    /// @notice Accepts a native-token donation for a cause and emits `CauseClosed` when the goal is first reached.
    function donate(uint256 causeId) external payable {
        _donate(causeId, false);
    }

    /// @notice Accepts a native-token donation for a cause without persisting the donor address on-chain.
    function donateAnonymous(uint256 causeId) external payable {
        _donate(causeId, true);
    }

    /// @notice Returns the number of donation records stored for a cause.
    function donationCount(uint256 causeId) external view returns (uint256) {
        return donationRecords[causeId].length;
    }

    /// @notice Returns a stored donation record for a cause.
    function getDonation(uint256 causeId, uint256 index)
        external
        view
        returns (address donor, uint256 amount, bool isAnonymous)
    {
        DonationRecord storage record = donationRecords[causeId][index];
        return (record.donor, record.amount, record.isAnonymous);
    }

    function _donate(uint256 causeId, bool isAnonymous) internal {
        if (msg.value == 0) revert ZeroDonation();
        Cause storage c = causes[causeId];
        if (c.targetAmount == 0) revert UnknownCause();

        c.raisedAmount += msg.value;
        address donorToStore = isAnonymous ? address(0) : msg.sender;
        donationRecords[causeId].push(
            DonationRecord({donor: donorToStore, amount: msg.value, isAnonymous: isAnonymous})
        );
        emit Donation(causeId, donorToStore, msg.value, c.raisedAmount, isAnonymous);

        if (!c.goalReachedEmitted && c.raisedAmount >= c.targetAmount) {
            c.goalReachedEmitted = true;
            emit CauseClosed(causeId, c.raisedAmount, c.targetAmount);
        }
    }

    /// @notice Transfers contract balance to the owner (e.g. for off-chain disbursement workflows).
    function withdraw(uint256 amount, address payable to) external onlyOwner {
        to.transfer(amount);
    }
}
