// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "hardhat/console.sol";
import {WadRayMath} from "./libraries/math/WadRayMath.sol";
import {Ownable} from "./libraries/openzeppelin/Ownable.sol";

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
contract ArtiStake is Ownable {
    using WadRayMath for uint256;

    address payable public aaveLendingPool;
    address payable public aaveWETHGateway;
    address public aTokenAddress;
    address public underlyingAsset;

    uint256 constant MAX_UINT = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;
    uint256 constant interestRatioBase = 10000;
    uint256 public artistInterestRatio = 5000;
    uint256 public artiStakeFeeRatio = 500;

    mapping(address => bool) public artistList;
    mapping(address => mapping(address => uint256)) public depositedAmounts;
    mapping(address => mapping(address => uint256)) public atokenAmounts;

    event Deposited(address indexed from, address indexed artistAddress, uint256 amount);
    event Withdrew(address indexed withdrawer, address indexed artistAddress, uint256 amount);
    event AddedToArtistlist(address indexed artistAddress);
    event RemovedFromArtistlist(address indexed artistAddress);
    event UpdatedArtistInterestRatio(uint256 ratio);
    event UpdatedArtiStakeFeeRatio(uint256 ratio);

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

    function deposit(address artistAddress, uint16 _referralCode) public payable {
        require(artistList[artistAddress], "Artist not Registered");
        uint256 contractBalanceBefore = getAtokenScaledBalance(aTokenAddress);
        IWETHGateway(aaveWETHGateway).depositETH{value: msg.value}(aaveLendingPool, address(this), _referralCode);
        uint256 contractBalanceAfter = getAtokenScaledBalance(aTokenAddress);
        atokenAmounts[artistAddress][msg.sender] += (contractBalanceAfter - contractBalanceBefore);
        depositedAmounts[artistAddress][msg.sender] += msg.value;
        emit Deposited(msg.sender, artistAddress, msg.value);
    }

    function withdraw(address payable artistAddress) public {
        require(artistList[artistAddress], "Artist not Registered");
        uint256 atokenAmount = atokenAmounts[artistAddress][msg.sender];
        require(atokenAmount > 0, "currently not deposited");
        uint256 depositedAmount = depositedAmounts[artistAddress][msg.sender];
        uint256 userBalanceWithInterest = atokenAmount.rayMul(
            ILendingPool(aaveLendingPool).getReserveNormalizedIncome(underlyingAsset)
        );
        uint256 totalInterest = userBalanceWithInterest - depositedAmount;
        IWETHGateway(aaveWETHGateway).withdrawETH(aaveLendingPool, userBalanceWithInterest, address(this));
        uint256 artistInterest = (totalInterest * artistInterestRatio) / interestRatioBase;
        uint256 artiStakeFee = (totalInterest * artiStakeFeeRatio) / interestRatioBase;
        uint256 stakerReward = userBalanceWithInterest - artistInterest - artiStakeFee;

        artistAddress.transfer(artistInterest);
        payable(owner()).transfer(artiStakeFee);
        payable(msg.sender).transfer(stakerReward);

        atokenAmounts[artistAddress][msg.sender] -= atokenAmount;
        depositedAmounts[artistAddress][msg.sender] -= userBalanceWithInterest;
        emit Withdrew(msg.sender, artistAddress, userBalanceWithInterest);
    }

    function getAtokenScaledBalance(address asset) public view returns (uint256) {
        return IERC20(asset).scaledBalanceOf(address(this));
    }

    function getStakerBalanceWithInterest(address artistAddress) public view returns (uint256) {
        uint256 atokenAmount = atokenAmounts[artistAddress][msg.sender];
        uint256 userBalanceWithInterest = atokenAmount.rayMul(
            ILendingPool(aaveLendingPool).getReserveNormalizedIncome(underlyingAsset)
        );
        return userBalanceWithInterest;
    }

    function registerToArtistlist(address artistAddress) public onlyOwner {
        require(artistList[artistAddress] == false, "already registered");
        artistList[artistAddress] = true;
        emit AddedToArtistlist(artistAddress);
    }

    function removeFromArtistlist(address artistAddress) public onlyOwner {
        require(artistList[artistAddress] == true, "not listed");
        artistList[artistAddress] = false;
        emit RemovedFromArtistlist(artistAddress);
    }

    function updateArtistInterestRatio(uint256 ratio) public onlyOwner {
        require(ratio < interestRatioBase, "ratio must be smaller than base");
        artistInterestRatio = ratio;
        emit UpdatedArtistInterestRatio(ratio);
    }

    function updateArtiStakeFeeRatio(uint256 ratio) public onlyOwner {
        require(ratio < interestRatioBase, "ratio must be smaller than base");
        artiStakeFeeRatio = ratio;
        emit UpdatedArtiStakeFeeRatio(ratio);
    }

    receive() external payable {}

    fallback() external payable {}
}
