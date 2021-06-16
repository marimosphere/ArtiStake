import {
  POLYGON_WETH_ADDRESS,
  POLYGON_AAVE_LENDING_POOL_ADDRESS,
  POLYGON_AAVE_WETH_GATEWAY_ADDRESS,
} from "../lib/constants";

//TODO: update artist address when deploy
const artistAddress = "0xaad0bb0dFfaEF8C2b0C07Dc9Ba9603083E8bE1f5";

// module.exports = async ({ getNamedAccounts, deployments }) => {
const func = async function (hre: any) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  await deploy("ArtistAaveMaticVault", {
    from: deployer,
    args: [artistAddress, POLYGON_WETH_ADDRESS, POLYGON_AAVE_LENDING_POOL_ADDRESS, POLYGON_AAVE_WETH_GATEWAY_ADDRESS],
    log: true,
  });
};

export default func;
module.exports.tags = ["ArtistAaveMaticVault"];
