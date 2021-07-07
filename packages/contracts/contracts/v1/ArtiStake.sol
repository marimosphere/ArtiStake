// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

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
}

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 */
contract ArtiStake {
    address payable public aaveLendingPool;
    address payable public aaveWETHGateway;

    uint256 constant MAX_UINT = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;

    mapping(address => bool) public artistAddresses;
    mapping(address => mapping(address => uint256)) public depositedAmounts;

    event Deposited(address indexed from, address indexed artistAddress, uint256 amount);
    event Withdrew(address indexed withdrawer, address indexed artistAddress, uint256 amount);

    constructor(
        address payable _aaveLendingPool,
        address payable _aaveWETHGateway,
        address _currency
    ) public {
        aaveLendingPool = _aaveLendingPool;
        aaveWETHGateway = _aaveWETHGateway;
        address aTokenAddress = ILendingPool(_aaveLendingPool).getReserveData(_currency).aTokenAddress;
        IERC20(aTokenAddress).approve(aaveWETHGateway, MAX_UINT);
    }

    function deposit(
        // address artistAddress,
        // uint256 amount,
        uint16 _referralCode
    ) public payable {
        // require(artistAddresses[artistAddress], "Artist not Registered");
        // Aaveにdeposit
        IWETHGateway(aaveWETHGateway).depositETH{value: msg.value}(aaveLendingPool, address(this), _referralCode);
        // depositedAmounts[artistAddress][msg.sender] += amount;
        // emit Deposited(msg.sender, artistAddress, amount);
    }

    function withdraw(uint256 amount) public {
        // require(artistAddresses[artistAddress], "Artist not Registered");
        // require(depositedAmounts[artistAddress][msg.sender] > amount, "not enough deposited balance");
        // Aaveからwithdraw
        IWETHGateway(aaveWETHGateway).withdrawETH(aaveLendingPool, amount, address(this));
        // address payable sender = payable(msg.sender);
        // sender.transfer(amount);
        // transfer
        // depositedAmounts[artistAddress][msg.sender] -= amount;
        // emit Withdrew(msg.sender, artistAddress, amount);
    }

    fallback() external payable {}
}
