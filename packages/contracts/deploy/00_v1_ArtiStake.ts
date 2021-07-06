import {
  POLYGON_AAVE_LENDING_POOL_ADDRESS,
  POLYGON_AAVE_WETH_GATEWAY_ADDRESS,
} from "../lib/constants";

// module.exports = async ({ getNamedAccounts, deployments }) => {
const func = async (hre: any) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  await deploy("ArtiStake", {
    from: deployer,
    args: [POLYGON_AAVE_LENDING_POOL_ADDRESS, POLYGON_AAVE_WETH_GATEWAY_ADDRESS],
    log: true,
  });
};

export default func;
module.exports.tags = ["ArtiStake"];
