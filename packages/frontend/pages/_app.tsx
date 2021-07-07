import "../styles/globals.css";
import { Web3ReactProvider } from "@web3-react/core";

const getLibrary = (provider: any) => {
  return provider;
};

const MyApp = ({ Component, pageProps }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Component {...pageProps} />
    </Web3ReactProvider>
  );
};

export default MyApp;
