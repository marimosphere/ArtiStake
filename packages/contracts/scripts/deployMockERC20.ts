import { ethers } from "hardhat";

export const main = async () => {
  const ERC20 = await ethers.getContractFactory("JPYC");
  const mockErc20Contract = await ERC20.deploy();
  console.log(mockErc20Contract.address);
  await mockErc20Contract.mint("0xc1F205e22973C9475f936E36657660830643dEBc", 1000000000000000);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
