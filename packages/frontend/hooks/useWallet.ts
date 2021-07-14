import * as React from "react";

import { useWeb3React } from "@web3-react/core";
import { injectedConnector } from "../lib/web3";
import { Web3Provider } from "@ethersproject/providers";

export const useWallet = () => {
  const { activate, account, library } = useWeb3React<Web3Provider>();

  const connectWallet = () => {
    activate(injectedConnector);
  };

  return [connectWallet, account, library];
};
