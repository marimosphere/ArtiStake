import { InjectedConnector } from "@web3-react/injected-connector";
import { ethers } from "ethers";
import externalContracts from "../contracts/external_contracts";
import { networkId, rpc } from "./env";

export const injectedConnector = new InjectedConnector({});

const getAbis = () => {
  const stakeContractAddress = externalContracts[networkId].contracts.stake.address;
  const stakeContractAbi = externalContracts[networkId].contracts.stake.abi;
  const tipContractAddress = externalContracts[networkId].contracts.tip.address;
  const tipContractAbi = externalContracts[networkId].contracts.tip.abi;
  const jpycAddress = externalContracts[networkId].contracts.jpyc.address;
  const jpycAbi = externalContracts[networkId].contracts.jpyc.abi;
  const usdcAddress = externalContracts[networkId].contracts.usdc.address;
  const usdcAbi = externalContracts[networkId].contracts.usdc.abi;
  return {
    stakeContractAddress,
    stakeContractAbi,
    tipContractAddress,
    tipContractAbi,
    jpycAddress,
    jpycAbi,
    usdcAddress,
    usdcAbi,
  };
};

const getContract = (abi: any, address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  const signerOrProvider = signer ?? simpleRpcProvider;
  return new ethers.Contract(address, abi, signerOrProvider);
};

export const simpleRpcProvider = new ethers.providers.JsonRpcProvider(rpc);

export const getArtistakeContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  const { stakeContractAddress, stakeContractAbi } = getAbis();
  return getContract(stakeContractAbi, stakeContractAddress, signer);
};

export const getTipContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  const { tipContractAddress, tipContractAbi } = getAbis();
  return getContract(tipContractAbi, tipContractAddress, signer);
};

export const getJpycContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  const { jpycAddress, jpycAbi } = getAbis();
  return getContract(jpycAbi, jpycAddress, signer);
};

export const getUsdcContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  const { usdcAddress, usdcAbi } = getAbis();
  return getContract(usdcAbi, usdcAddress, signer);
};
