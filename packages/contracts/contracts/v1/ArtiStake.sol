// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.6.12;

import {ILendingPool} from "@aave/protocol-v2/contracts/interfaces/ILendingPool.sol";
import {IWETHGateway} from "@aave/protocol-v2/contracts/misc/interfaces/IWETHGateway.sol";

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 */
contract ArtiStake {
    address payable public aaveLendingPool;
    address payable public aaveWETHGateway;

    mapping(address => bool) public artistAddresses;

    mapping(address => mapping(address => uint256)) public depositedAmounts;

    event Deposited(address indexed from, address indexed artistAddress, uint256 amount);
    event Withdrew(address indexed withdrawer, address indexed artistAddress, uint256 amount);

    constructor(address payable _aaveLendingPool, address payable _aaveWETHGateway) public {
        aaveLendingPool = _aaveLendingPool;
        aaveWETHGateway = _aaveWETHGateway;
    }

    function deposit(
        // address artistAddress,
        uint256 amount,
        uint16 _referralCode
    ) public {
        // require(artistAddresses[artistAddress], "Artist not Registered");
        // Aaveにdeposit
        IWETHGateway(aaveWETHGateway).depositETH{value: amount}(address(this), _referralCode);
        // depositedAmounts[artistAddress][msg.sender] += amount;
        // emit Deposited(msg.sender, artistAddress, amount);
    }

    function withdraw(address artistAddress, uint256 amount) public {
        // require(artistAddresses[artistAddress], "Artist not Registered");
        // require(depositedAmounts[artistAddress][msg.sender] > amount, "not enough deposited balance");
        // Aaveからwithdraw
        IWETHGateway(aaveWETHGateway).withdrawETH(amount, address(this));
        // address payable sender = payable(msg.sender);
        // sender.transfer(amount);
        // transfer
        // depositedAmounts[artistAddress][msg.sender] -= amount;
        emit Withdrew(msg.sender, artistAddress, amount);
    }
}
