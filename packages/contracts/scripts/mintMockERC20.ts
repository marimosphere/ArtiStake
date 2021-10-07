import { ethers } from "hardhat";

import { MOCK_ERC20_ADDRESS, DEV_ADDRESS } from "../lib/constants";

export const main = async () => {
  const ERC20 = await ethers.getContractFactory("JPYC");
  await ERC20.attach(MOCK_ERC20_ADDRESS).mint(DEV_ADDRESS, 1000000000000000);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
