// ref: https://github.com/aave/protocol-v2/blob/master/contracts/misc/WETHGateway.sol

pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

contract WETHGateway {
    constructor() public {}

    function depositETH(
        address lendingPool,
        address onBehalfOf,
        uint16 referralCode
    ) external payable {
        // Dummy
    }

    function withdrawETH(
        address lendingPool,
        uint256 amount,
        address to
    ) external {
        // Dummy
        _safeTransferETH(to, amount);
    }

    function _safeTransferETH(address to, uint256 value) internal {
        (bool success, ) = to.call{value: value}(new bytes(0));
        require(success, "ETH_TRANSFER_FAILED");
    }

    function emergencyEtherTransfer(address to, uint256 amount) external {
        _safeTransferETH(to, amount);
    }

    receive() external payable {}

    fallback() external payable {}
}
