// "SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";
import "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import "@chainlink/contracts/src/v0.8/Chainlink.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

// @title The Chainlink Oracle contract
contract Client is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;

    uint256 public currentPrice;

    event RequestPriceFulfilled(
        bytes32 indexed requestId,
        uint256 indexed price
    );

    // @notice Deploy with the address of the LINK token
    // @dev Sets the LinkToken address for the imported LinkTokenInterface
    // @param Link The address of the LINK token
    constructor(address link) ConfirmedOwner(msg.sender) {
        if (link == address(0)) {
            _setPublicChainlinkToken();
        } else {
            _setChainlinkToken(link);
        }
    }

    function requestPrice(
        address _oracle,
        string memory _jobId,
        uint256 payment
    ) public onlyOwner {
        Chainlink.Request memory req = _buildChainlinkRequest(
            stringToBytes32(_jobId),
            address(this),
            this.fulfillPrice.selector
        );
        req._add(
            "get",
            "https://api.coingate.com/v2/rates/merchant/USD/RUB"
        );

        req._addInt("times", 100);
        _sendChainlinkRequestTo(_oracle, req, payment * LINK_DIVISIBILITY);
    }


    function fulfillPrice(bytes32 _requestId, uint256 _price)
    public
    recordChainlinkFulfillment(_requestId) {
        emit RequestPriceFulfilled(_requestId, _price);
        currentPrice = _price;
    }

    function getChainlinkToken() public view returns (address) {
        return _chainlinkTokenAddress();
    }

    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(_chainlinkTokenAddress());
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer"
        );
    }

    function stringToBytes32(string memory source) private pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            result := mload(add(source, 32))
        }
    }
}
