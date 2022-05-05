// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import {WadRayMath} from "./libraries/math/WadRayMath.sol";
import {Ownable} from "./libraries/openzeppelin/Ownable.sol";
import {SafeMath} from "./libraries/openzeppelin/SafeMath.sol";

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
    using SafeMath for uint256;

    address payable public aaveLendingPool;
    address payable public aaveWETHGateway;
    address public aTokenAddress;
    address public underlyingAsset;

    uint256 constant MAX_UINT = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;
    uint256 public constant interestRatioBase = 10000;
    uint256 public artistInterestRatio = 5000;
    uint256 public artiStakeFeeRatio = 500;

    mapping(address => mapping(address => uint256)) public depositedAmounts;
    mapping(address => mapping(address => uint256)) public atokenAmounts;
    mapping(address => uint256) public artistStakedAmounts;

    event Deposited(address indexed from, address indexed artistAddress, uint256 amount);
    event Withdrew(address indexed withdrawer, address indexed artistAddress, uint256 amount);
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
        // aTokenAddress = ILendingPool(_aaveLendingPool).getReserveData(_currency).aTokenAddress;
        // IERC20(aTokenAddress).approve(aaveWETHGateway, MAX_UINT);
    }

    function deposit(address artistAddress, uint16 _referralCode) public payable {
        // TODO: Mock
        uint256 depositedAtoken = msg.value;
        atokenAmounts[artistAddress][msg.sender] = atokenAmounts[artistAddress][msg.sender].add(depositedAtoken);
        depositedAmounts[artistAddress][msg.sender] = depositedAmounts[artistAddress][msg.sender].add(msg.value);
        artistStakedAmounts[artistAddress] = artistStakedAmounts[artistAddress].add(depositedAtoken);
        emit Deposited(msg.sender, artistAddress, msg.value);
        // uint256 contractBalanceBefore = getAtokenScaledBalance(aTokenAddress);
        // IWETHGateway(aaveWETHGateway).depositETH{value: msg.value}(aaveLendingPool, address(this), _referralCode);
        // uint256 contractBalanceAfter = getAtokenScaledBalance(aTokenAddress);
        // uint256 depositedAtoken = contractBalanceAfter.sub(contractBalanceBefore);
        // atokenAmounts[artistAddress][msg.sender] = atokenAmounts[artistAddress][msg.sender].add(depositedAtoken);
        // depositedAmounts[artistAddress][msg.sender] = depositedAmounts[artistAddress][msg.sender].add(msg.value);
        // artistStakedAmounts[artistAddress] = artistStakedAmounts[artistAddress].add(depositedAtoken);
        // emit Deposited(msg.sender, artistAddress, msg.value);
    }

    function withdraw(address payable artistAddress) public {
        // TODO: Mock
        uint256 atokenAmount = atokenAmounts[artistAddress][msg.sender];
        require(atokenAmount > 0, "currently not deposited");
        uint256 depositedAmount = depositedAmounts[artistAddress][msg.sender];
        uint256 userBalanceWithInterest = getAmountWithInterest(atokenAmount);
        uint256 totalInterest = userBalanceWithInterest.sub(depositedAmount);
        // IWETHGateway(aaveWETHGateway).withdrawETH(aaveLendingPool, userBalanceWithInterest, address(this));
        uint256 artistInterest = (totalInterest.mul(artistInterestRatio)).div(interestRatioBase);
        uint256 artiStakeFee = (totalInterest.mul(artiStakeFeeRatio)).div(interestRatioBase);
        uint256 stakerReward = userBalanceWithInterest.sub(artistInterest).sub(artiStakeFee);

        atokenAmounts[artistAddress][msg.sender] = 0;
        depositedAmounts[artistAddress][msg.sender] = 0;
        artistStakedAmounts[artistAddress] = artistStakedAmounts[artistAddress].sub(atokenAmount);

        artistAddress.transfer(artistInterest);
        payable(owner()).transfer(artiStakeFee);
        payable(msg.sender).transfer(stakerReward);
        emit Withdrew(msg.sender, artistAddress, userBalanceWithInterest);
    }

    function getAtokenScaledBalance(address asset) public view returns (uint256) {
        return IERC20(asset).scaledBalanceOf(address(this));
    }

    function getStakerBalanceWithInterest(address artistAddress, address sender) public view returns (uint256) {
        uint256 atokenAmount = atokenAmounts[artistAddress][sender];
        uint256 userBalanceWithInterest = getAmountWithInterest(atokenAmount);
        return userBalanceWithInterest;
    }

    function getArtistTotalStaked(address artistAddress) public view returns (uint256) {
        uint256 atokenAmount = artistStakedAmounts[artistAddress];
        uint256 artistTotalStaked = getAmountWithInterest(atokenAmount);
        return artistTotalStaked;
    }

    function getAmountWithInterest(uint256 atokenAmount) public view returns (uint256) {
        // TODO: Mock
        return atokenAmount;
        // return atokenAmount.rayMul(ILendingPool(aaveLendingPool).getReserveNormalizedIncome(underlyingAsset));
    }

    function updateArtistInterestRatio(uint256 ratio) public onlyOwner {
        require(
            ratio.add(artiStakeFeeRatio) < interestRatioBase,
            "ratio + artiStakeFeeRatio must be smaller than base"
        );
        artistInterestRatio = ratio;
        emit UpdatedArtistInterestRatio(ratio);
    }

    function updateArtiStakeFeeRatio(uint256 ratio) public onlyOwner {
        require(
            ratio.add(artistInterestRatio) < interestRatioBase,
            "ratio + artistInterestRatio must be smaller than base"
        );
        artiStakeFeeRatio = ratio;
        emit UpdatedArtiStakeFeeRatio(ratio);
    }

    receive() external payable {}

    fallback() external payable {}
}
