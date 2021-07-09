import "../styles/globals.css";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { ethers } from "ethers";

const getLibrary = (provider: any) => {
  const ethresProvider = new ethers.providers.Web3Provider(provider);
  return ethresProvider;
};

const MyApp = ({ Component, pageProps }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Component {...pageProps} />
    </Web3ReactProvider>
  );
};

export default MyApp;
