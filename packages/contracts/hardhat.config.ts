import "@nomiclabs/hardhat-waffle";
import "hardhat-typechain";
import "hardhat-deploy";

const privateKey = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000"; // this is to avoid hardhat error

import network from "./network.json";

module.exports = {
  solidity: "0.8.0",
  namedAccounts: {
    deployer: 0,
  },
  networks: {
    localhost: {
      timeout: 50000,
    },
    hardhat: {
      forking: {
        url: network.mainnet.rpc,
      },
    },
    mainnet: {
      url: network.mainnet.rpc,
      accounts: [privateKey],
    }
  },
};
