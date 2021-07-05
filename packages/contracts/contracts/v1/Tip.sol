//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Tip is Ownable{
    
    mapping (address => bool) public whitelisted;
    
    event Tipped (address indexed from, address indexed to, address indexed erc20, uint256 amount);
    event AddedToWhitelist (address indexed addedToken);
    event RemovedFromWhitelist (address indexed removedToken);
    
    function addToWhitelist (address addToken)  public onlyOwner {
        require(whitelisted[addToken] == false);
        whitelisted[addToken] = true;
        emit AddedToWhitelist(addToken);
    }

    function removeFromWhitelist (address removeToken) public onlyOwner {
        require(whitelisted[removeToken] == true);
        whitelisted[removeToken] = false;
        emit RemovedFromWhitelist(removeToken);
    }
    
    //Send "token" from "msg.sender" to "address to"
    function tip (address token,address to, uint amount) payable public {
        //Check "token" is whitelisted or not
        require(whitelisted[token] == true);
        IERC20(token).transferFrom(msg.sender,to,amount);
        emit Tipped (msg.sender,to,token,amount);
    }
}