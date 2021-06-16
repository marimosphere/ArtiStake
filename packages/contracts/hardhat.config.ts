import "@nomiclabs/hardhat-waffle";
import "hardhat-typechain";
import "hardhat-deploy";

module.exports = {
  solidity: "0.8.0",
  namedAccounts: {
    deployer: 0,
  },
};
