import "../styles/globals.css";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { ethers } from "ethers";
import firebase from "../lib/firebase";
import * as React from "react";

const getLibrary = (provider: any) => {
  const ethresProvider = new ethers.providers.Web3Provider(provider);
  return ethresProvider;
};

const MyApp = ({ Component, pageProps }) => {
  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      firebase.analytics();
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
