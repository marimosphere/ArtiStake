//SPDX-License-Identifier: Unlicense
pragma solidity ^0.6.12;

import "hardhat/console.sol";
import {IERC20} from "../dependencies/openzeppelin/IERC20.sol";
import {Ownable} from "../dependencies/openzeppelin/Ownable.sol";

contract Tip is Ownable {
    mapping(address => bool) public whitelisted;

    event Tipped(address indexed from, address indexed to, address indexed erc20, uint256 amount);
    event AddedToWhitelist(address indexed addedToken);
    event RemovedFromWhitelist(address indexed removedToken);

    function addToWhitelist(address addToken) public onlyOwner {
        require(whitelisted[addToken] == false, "Tip: already added to whitelist");
        whitelisted[addToken] = true;
        emit AddedToWhitelist(addToken);
    }

    function removeFromWhitelist(address removeToken) public onlyOwner {
        require(whitelisted[removeToken] == true, "Tip: cannot remove token not listed");
        whitelisted[removeToken] = false;
        emit RemovedFromWhitelist(removeToken);
    }

    //Send "token" from "msg.sender" to "address to"
    function tip(
        address token,
        address to,
        uint256 amount
    ) public payable {
        //Check "token" is whitelisted or not
        require(whitelisted[token] == true, "Tip: cannot tip token not listed");
        IERC20(token).transferFrom(msg.sender, to, amount);
        emit Tipped(msg.sender, to, token, amount);
    }
}
