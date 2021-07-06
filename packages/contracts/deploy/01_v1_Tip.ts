import { updateJson } from "../helpers/migrations";
 
  // module.exports = async ({ getNamedAccounts, deployments }) => {
  const func = async (hre: any) => {
    const { deployments, getNamedAccounts } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const contract = await deploy("Tip", {
        from: deployer,
        log: true,
        args: [],
    });
    
    updateJson("tip",contract.receipt.contractAddress);
  };

  
  export default func;
  module.exports.tags = ["Tip"];
  