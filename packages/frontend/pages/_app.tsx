import "../styles/globals.css";
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";
import firebase from "../lib/firebase";
import * as React from "react";

import { networkId } from "../lib/env";

const getLibrary = (provider: any) => {
  const ethresProvider = new ethers.providers.Web3Provider(provider);
  return ethresProvider;
};

const MyApp = ({ Component, pageProps }) => {
  React.useEffect(() => {
    if (window.ethereum) {
      const data =
        networkId === 81
          ? [
              {
                chainId: "0x51",
                chainName: "Shibuya",
                nativeCurrency: {
                  name: "SBY",
                  symbol: "SBY",
                  decimals: 18,
                },
                rpcUrls: ["https://rpc.shibuya.astar.network:8545"],
                blockExplorerUrls: ["https://shibuya.subscan.io/"],
              },
            ]
          : [
              {
                chainId: "0x250",
                chainName: "Astar",
                nativeCurrency: {
                  name: "ASTR",
                  symbol: "ASTR",
                  decimals: 18,
                },
                rpcUrls: ["https://rpc.astar.network:8545", "https://astar.api.onfinality.io/public"],
                blockExplorerUrls: ["https://blockscout.com/astar/"],
              },
            ];
      // networkId === 137
      //   ? [
      //       {
      //         chainId: "0x89",
      //         chainName: "Matic Network",
      //         nativeCurrency: {
      //           name: "Matic",
      //           symbol: "Matic",
      //           decimals: 18,
      //         },
      //         rpcUrls: ["https://rpc-mainnet.matic.network/"],
      //         blockExplorerUrls: ["https://polygonscan.com/"],
      //       },
      //     ]
      //   : [
      //       {
      //         chainId: "0x13881",
      //         chainName: "Matic Test Network",
      //         nativeCurrency: {
      //           name: "Matic",
      //           symbol: "Matic",
      //           decimals: 18,
      //         },
      //         rpcUrls: ["https://rpc-mumbai.matic.today/"],
      //         blockExplorerUrls: ["https://explorer-mumbai.maticvigil.com/"],
      //       },
      //     ];

      window.ethereum.request({ method: "wallet_addEthereumChain", params: data });
    }
  }, []);

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Component {...pageProps} />
      <style jsx global>{`
        body {
          background: #1c203c;
        }
      `}</style>
    </Web3ReactProvider>
  );
};

export default MyApp;
