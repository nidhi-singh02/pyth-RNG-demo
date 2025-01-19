// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@pythnetwork/entropy-sdk-solidity/IEntropy.sol";
import "@pythnetwork/entropy-sdk-solidity/IEntropyConsumer.sol";

/// Example contract using Pyth Entropy to allow a user to flip a secure fair coin.
/// Users interact with the contract by requesting a random number from the entropy provider.
/// The entropy provider will then fulfill the request by revealing their random number.
/// Once the provider has fulfilled their request the entropy contract will call back
/// the requesting contract with the generated random number.
///
/// The CoinFlip contract implements the IEntropyConsumer interface imported from the Solidity SDK.
/// The interface helps in integrating with Entropy correctly.
contract CoinFlip is IEntropyConsumer {
    // Event emitted when a coin flip is requested. The sequence number can be used to identify a request
    event FlipRequested(uint64 sequenceNumber);
    // Event emitted when the result of the coin flip is known.
    event FlipResult(uint64 sequenceNumber, bool isHeads);

    IEntropy entropy;
    address provider;

    constructor(address _entropy, address _provider) {
        entropy = IEntropy(_entropy);
        provider = _provider;
    }

    // This method is required by the IEntropyConsumer interface
    function getEntropy() internal view override returns (address) {
        return address(entropy);
    }

    function request(bytes32 userRandomNumber) external payable {
        // get the required fee
        uint128 requestFee = entropy.getFee(provider);
        // check if the user has sent enough fees
        if (msg.value < requestFee) revert("not enough fees");

        // pay the fees and request a random number from entropy
        uint64 sequenceNumber = entropy.requestWithCallback{value: requestFee}(provider, userRandomNumber);

        // emit event
        emit FlipRequested(sequenceNumber);
    }

    // This method is required by the IEntropyConsumer Interface
    function entropyCallback(
        uint64 sequenceNumber,
        // If your app uses multiple providers, you can use this argument
        // to distinguish which one is calling the app back. This app only
        // uses one provider so this argument is not used.
        address _providerAddress,
        bytes32 randomNumber
    ) internal override {
        bool isHeads = uint256(randomNumber) % 2 == 0;

        emit FlipResult(sequenceNumber, isHeads);
    }
}
