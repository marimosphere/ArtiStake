import "@nomiclabs/hardhat-waffle";
import "hardhat-typechain";
import "hardhat-deploy";
import "solidity-coverage";

const privateKey = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000"; // this is to avoid hardhat error
// import network from "./network.json";

module.exports = {
  solidity: "0.6.12",
  namedAccounts: {
    deployer: 0,
  },
  networks: {
    localhost: {
      timeout: 50000,
    },
    hardhat: {
      forking: {
        url: "https://polygon-mainnet.infura.io/v3/7495501b681645b0b80f955d4139add9",
      },
    },
    // mainnet: {
    //   url: network.mainnet.rpc,
    //   accounts: [privateKey],
    // },
    // kovan: {
    //   url: network.kovan.rpc,
    //   accounts: [privateKey],
    // },
  },
  mocha: {
    timeout: 50000,
  },
};
