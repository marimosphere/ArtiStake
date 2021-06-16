//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ArtistAaveMaticVault is ERC20, Ownable {
    uint256 constant MAX_UINT = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;

    address public artist;
    address public token;
    address public aaveLendingPool;
    address public aaveWETHGateway;

    constructor(
        address _artist,
        address _token,
        address _aaveLendingPool,
        address _aaveWETHGateway
    ) ERC20("ArtiStakeToken", "AST") {
        artist = _artist;
        token = _token;
        aaveLendingPool = _aaveLendingPool;
        aaveWETHGateway = _aaveWETHGateway;

        // TODO: このあたりのRequireは適当にやっているので調査が必要
        // require(aToken != address(0x0), "currency must be included in the aave reserve list");
        // require(keccak256(abi.encodePacked(IERC20Metadata(aTokenAddress).symbol())) == keccak256("aWETH"), "currency must be included in the aave reserve list");

        // TODO: このあたりのApproveは適当にやっているので調査が必要
        // IERC20(_currency).safeApprove(aaveWETHGateway, MAX_UINT);
        // IERC20(_currency).safeApprove(aaveLendingPool, MAX_UINT);
        // IERC20(aTokenAddress).safeApprove(aaveWETHGateway, MAX_UINT);
        // IERC20(aTokenAddress).safeApprove(aaveLendingPool, MAX_UINT);
    }
}
