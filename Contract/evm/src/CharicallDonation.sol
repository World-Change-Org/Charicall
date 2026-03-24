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

    address public owner;

    mapping(uint256 causeId => Cause) public causes;
    mapping(address organisation => bool) public verifiedOrganisations;

    /// @notice Emitted for every donation received for a cause.
    event Donation(uint256 indexed causeId, address indexed donor, uint256 amount, uint256 newTotalRaised);

    /// @notice Emitted once when `raisedAmount` first meets or exceeds `targetAmount` for a cause.
    /// @param causeId The cause identifier.
    /// @param totalRaised The cumulative amount raised at the time the goal was met (may exceed target).
    /// @param targetAmount The funding goal for the cause.
    event CauseClosed(uint256 indexed causeId, uint256 totalRaised, uint256 targetAmount);

    /// @notice Emitted when an organisation's verification badge is updated on-chain.
    event OrganisationVerificationUpdated(address indexed organisation, bool isVerified);

    error NotOwner();
    error ZeroTarget();
    error CauseAlreadyExists();
    error UnknownCause();
    error ZeroDonation();
    error ZeroOrganisation();

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
        if (msg.value == 0) revert ZeroDonation();
        Cause storage c = causes[causeId];
        if (c.targetAmount == 0) revert UnknownCause();

        c.raisedAmount += msg.value;
        emit Donation(causeId, msg.sender, msg.value, c.raisedAmount);

        if (!c.goalReachedEmitted && c.raisedAmount >= c.targetAmount) {
            c.goalReachedEmitted = true;
            emit CauseClosed(causeId, c.raisedAmount, c.targetAmount);
        }
    }

    /// @notice Transfers contract balance to the owner (e.g. for off-chain disbursement workflows).
    function withdraw(uint256 amount, address payable to) external onlyOwner {
        to.transfer(amount);
    }

    /// @notice Updates whether an organisation wallet should display a verified on-chain badge.
    function setOrganisationVerification(address organisation, bool isVerified) external onlyOwner {
        if (organisation == address(0)) revert ZeroOrganisation();
        verifiedOrganisations[organisation] = isVerified;
        emit OrganisationVerificationUpdated(organisation, isVerified);
    }
}
