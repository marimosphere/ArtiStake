// module.exports = async ({ getNamedAccounts, deployments }) => {
const func = async (hre: any) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  await deploy("ArtisTip", {
    from: deployer,
    log: true,
    args: [],
  });
};

export default func;
module.exports.tags = ["ArtisTip"];
