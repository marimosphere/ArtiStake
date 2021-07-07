// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "hardhat/console.sol";
import {WadRayMath} from "./libraries/math/WadRayMath.sol";

interface IWETHGateway {
    function depositETH(
        address lendingPool,
        address onBehalfOf,
        uint16 referralCode
    ) external payable;

    function withdrawETH(
        address lendingPool,
        uint256 amount,
        address onBehalfOf
    ) external;
}

interface IERC20 {
    function approve(address spender, uint256 amount) external returns (bool);

    function balanceOf(address account) external view returns (uint256);

    function scaledBalanceOf(address user) external view returns (uint256);
}

library DataTypes {
    struct ReserveData {
        ReserveConfigurationMap configuration;
        uint128 liquidityIndex;
        uint128 variableBorrowIndex;
        uint128 currentLiquidityRate;
        uint128 currentVariableBorrowRate;
        uint128 currentStableBorrowRate;
        uint40 lastUpdateTimestamp;
        address aTokenAddress;
        address stableDebtTokenAddress;
        address variableDebtTokenAddress;
        address interestRateStrategyAddress;
        uint8 id;
    }

    struct ReserveConfigurationMap {
        uint256 data;
    }
}

interface ILendingPool {
    function getReserveData(address asset) external view returns (DataTypes.ReserveData memory);

    function getReserveNormalizedIncome(address asset) external view returns (uint256);
}

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 */
contract ArtiStake {
    using WadRayMath for uint256;

    address payable public aaveLendingPool;
    address payable public aaveWETHGateway;
    address public aTokenAddress;
    address public underlyingAsset;

    uint256 constant MAX_UINT = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;

    mapping(address => bool) public artistAddresses;
    mapping(address => mapping(address => uint256)) public depositedAmounts;
    mapping(address => mapping(address => uint256)) public atokenAmounts;

    event Deposited(address indexed from, address indexed artistAddress, uint256 amount);
    event Withdrew(address indexed withdrawer, address indexed artistAddress, uint256 amount);

    constructor(
        address payable _aaveLendingPool,
        address payable _aaveWETHGateway,
        address _currency
    ) public {
        aaveLendingPool = _aaveLendingPool;
        aaveWETHGateway = _aaveWETHGateway;
        underlyingAsset = _currency;
        aTokenAddress = ILendingPool(_aaveLendingPool).getReserveData(_currency).aTokenAddress;
        IERC20(aTokenAddress).approve(aaveWETHGateway, MAX_UINT);
    }

    function deposit(
        address artistAddress,
        // uint256 amount,
        uint16 _referralCode
    ) public payable {
        // require(artistAddresses[artistAddress], "Artist not Registered");
        // Aaveにdeposit
        uint256 contractBalanceBefore = IERC20(aTokenAddress).scaledBalanceOf(address(this));
        IWETHGateway(aaveWETHGateway).depositETH{value: msg.value}(aaveLendingPool, address(this), _referralCode);
        uint256 contractBalanceAfter = IERC20(aTokenAddress).scaledBalanceOf(address(this));
        atokenAmounts[artistAddress][msg.sender] += (contractBalanceAfter - contractBalanceBefore);
        depositedAmounts[artistAddress][msg.sender] += msg.value;
        console.log(atokenAmounts[artistAddress][msg.sender], "atokenAmounts[artistAddress][msg.sender]");
        console.log(depositedAmounts[artistAddress][msg.sender], "depositedAmounts[artistAddress][msg.sender]");
        // emit Deposited(msg.sender, artistAddress, amount);
    }

    function withdraw(address payable artistAddress, uint256 amount) public {
        // require(artistAddresses[artistAddress], "Artist not Registered");
        // require(depositedAmounts[artistAddress][msg.sender] > amount, "not enough deposited balance");
        uint256 atokenAmount = atokenAmounts[artistAddress][msg.sender];
        uint256 depositedAmount = depositedAmounts[artistAddress][msg.sender];
        uint256 userBalanceWithInterest = atokenAmount.rayMul(
            ILendingPool(aaveLendingPool).getReserveNormalizedIncome(underlyingAsset)
        );
        uint256 totalInterest = userBalanceWithInterest - depositedAmount;

        console.log(atokenAmount, "atokenAmount");
        console.log(depositedAmount, "depositedAmount");
        console.log(userBalanceWithInterest, "userBalanceWithInterest");
        console.log(totalInterest, "totalInterest");

        IWETHGateway(aaveWETHGateway).withdrawETH(aaveLendingPool, amount, address(this));

        uint256 artistInterest = (totalInterest * amount) / depositedAmount / 2;
        uint256 stakerReward = amount - artistInterest;
        console.log(artistInterest, "artistInterest");
        console.log(stakerReward, "stakerReward");

        artistAddress.transfer(artistInterest);
        payable(msg.sender).transfer(stakerReward);

        atokenAmounts[artistAddress][msg.sender] -= amount.rayDiv(
            ILendingPool(aaveLendingPool).getReserveNormalizedIncome(underlyingAsset)
        );
        depositedAmounts[artistAddress][msg.sender] -= amount;
        // emit Withdrew(msg.sender, artistAddress, amount);
    }

    fallback() external payable {}
}
