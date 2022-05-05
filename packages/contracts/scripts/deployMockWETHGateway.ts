import { ethers } from "hardhat";

export const main = async () => {
  const WETHGateway = await ethers.getContractFactory("WETHGateway");
  const mockWETHGatewayContract = await WETHGateway.deploy();
  console.log(mockWETHGatewayContract.address);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
