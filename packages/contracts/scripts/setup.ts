import hre, { ethers } from "hardhat";
import {
  POLYGON_WETH_ADDRESS,
  POLYGON_AAVE_LENDING_POOL_ADDRESS,
  POLYGON_AAVE_WETH_GATEWAY_ADDRESS,
} from "../lib/constants";

export const main = async () => {
  const ERC20 = await ethers.getContractFactory("JPYC");
  const mockErc20Contract = await ERC20.deploy();
  console.log(mockErc20Contract.address);
  await mockErc20Contract.mint("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 1000000000000000);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
