const cors = require("cors")({ origin: true });
const functions = require("firebase-functions");
const { ethers } = require("ethers");
const externalContracts = require("./external_contracts");
const { networkId, rpc } = require("./env");

const rpcProvider = new ethers.providers.JsonRpcProvider(rpc);
const contractInfo = externalContracts[networkId].contracts.stake;
const stakeContract = new ethers.Contract(contractInfo.address, contractInfo.abi, rpcProvider);

exports.projects = functions.https.onRequest((req, res) => {
  const projectAddresses = Array.isArray(req.query.address) ? req.query.address : [req.query.address];
  functions.logger.debug("projects", { projectAddresses: projectAddresses });

  res.set("Access-Control-Allow-Origin", "*");
  getProjectsInfo(projectAddresses).then(projects => {
    res.send(projects);
  }).catch(e => {
    functions.logger.error(e);
    res.status(500).send({ error: e });
  });
});

async function getProjectsInfo(projectAddresses) {
  const result = [];
  for (const projectAddress of projectAddresses) {
    result.push(await getProjectInfo(projectAddress))
  }
  return result;
}

async function getProjectInfo(projectAddress) {
  const totalStaked = await stakeContract.getArtistTotalStaked(projectAddress);
  functions.logger.debug("projects", { totalStaked: Number(ethers.utils.formatEther(totalStaked)) });
  return {
    totalStaked: Number(ethers.utils.formatEther(totalStaked)),
    apy: 120 // Dummy
  };
}
