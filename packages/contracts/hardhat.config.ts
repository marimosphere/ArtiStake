import "@nomiclabs/hardhat-waffle";
import "hardhat-typechain";
import "hardhat-deploy";

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
    },
    kovan: {
      url: network.kovan.rpc,
      accounts: [privateKey],
    },
  },
};
