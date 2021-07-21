//SPDX-License-Identifier: Unlicense
pragma solidity ^0.6.12;

import {IERC20} from "./libraries/openzeppelin/IERC20.sol";
import {Ownable} from "./libraries/openzeppelin/Ownable.sol";

contract ArtisTip is Ownable {
    event Tipped(address indexed from, address indexed to, address indexed erc20, uint256 amount);

    function tip(
        address token,
        address payable to,
        uint256 amount
    ) public payable {
        if (token == address(0)) {
            to.transfer(msg.value);
            emit Tipped(msg.sender, to, token, amount);
        } else {
            IERC20(token).transferFrom(msg.sender, to, amount);
            emit Tipped(msg.sender, to, token, amount);
        }
    }
}
