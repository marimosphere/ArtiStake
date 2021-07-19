import hre, { ethers } from "hardhat";
import {
  POLYGON_WETH_ADDRESS,
  POLYGON_AAVE_LENDING_POOL_ADDRESS,
  POLYGON_AAVE_WETH_GATEWAY_ADDRESS,
} from "../lib/constants";

export const main = async () => {
  console.log(hre.network.name);
  const Tip = await ethers.getContractFactory("Tip");
  const tipContract = await Tip.deploy();
  const ERC20 = await ethers.getContractFactory("MintableERC20");
  const mockErc20Contract = await ERC20.deploy("TestToken", "TT", 18);
  await mockErc20Contract.mint(1000000000000000);
  await tipContract.addToWhitelist(mockErc20Contract.address);
  // const ArtiStake = await ethers.getContractFactory("ArtiStake");
  // const artiStakeContract = await ArtiStake.deploy(
  //   POLYGON_AAVE_LENDING_POOL_ADDRESS,
  //   POLYGON_AAVE_WETH_GATEWAY_ADDRESS,
  //   POLYGON_WETH_ADDRESS
  // );
  // console.log(artiStakeContract.address, "artiStakeContract.address");
  console.log(tipContract.address, "tipContract.address");
  console.log(mockErc20Contract.address, "mockErc20Contract.address");

  // TODO: フロントエンドのアドレスを書き換える
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
