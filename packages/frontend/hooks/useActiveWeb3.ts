import { useEffect, useState, useRef } from "react";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
// eslint-disable-next-line import/no-unresolved
import { Web3ReactContextInterface } from "@web3-react/core/dist/types";
import { ethers } from "ethers";

const rpc =
  process.env.NODE_ENV == "development"
    ? "http://localhost:8545"
    : "https://polygon-mainnet.infura.io/v3/7495501b681645b0b80f955d4139add9";

export const simpleRpcProvider = new ethers.providers.JsonRpcProvider(rpc);
/**
 * Provides a web3 provider with or without user's signer
 * Recreate web3 instance only if the provider change
 */
const useActiveWeb3React = (): Web3ReactContextInterface<Web3Provider> => {
  const { library, chainId, ...web3React } = useWeb3React();
  const refEth = useRef(library);
  const [provider, setprovider] = useState(library || simpleRpcProvider);

  useEffect(() => {
    if (library !== refEth.current) {
      setprovider(library || simpleRpcProvider);
      refEth.current = library;
    }
  }, [library]);

  return { library: provider, chainId: chainId, ...web3React };
};

export default useActiveWeb3React;
