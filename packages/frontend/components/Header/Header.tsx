import * as React from "react";
import Head from "next/head";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useWeb3React } from "@web3-react/core";
import { injectedConnector } from "../../lib/web3";
import { useWallet } from "../../hooks/useWallet";
import { HeaderProps } from "./types";

const Header: React.FC<HeaderProps> = ({ isConnectWallet }) => {
  const [isNavigactionOpen, setIsNavigationOpen] = React.useState(false);

  const [connectWallet, account, library] = useWallet();

  const navs = [
    { text: "Home", to: "/", target: false },
    { text: "About", to: "/about", target: false },
    { text: "How to get ASTR", to: "https://simplecryptoguide.com/ja/how-to-buy-eastar/", target: true },
    { text: "Get JPYC on Astar", to: "https://app.jpyc.jp/", target: true },
    /*{
      text: "Artist Registration",
      to: "https://docs.google.com/forms/d/e/1FAIpQLSeQmx1eeEfVFtSa14i1WtAtyAspm21ejuz54g1TEnoOr-OrFw/viewform?usp=sf_link",
      target: true,
    },*/
  ];

  return (
    <div className="flex justify-between w-full bg-marimo-3">
      <Head>
        <title>MetaverStake - Staking for Social Good Projects</title>
        <meta name="viewport" content="width=device-width" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="og:url" content="https://artistake.tokyo.app" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="MetaverStake - Staking for Social Good Projects" />
        <meta property="og:description" content=" MetaverStake supports social good projects by staking tokens" />
        <meta property="og:site_name" content="MetaverStake" />
        <meta property="og:image" content="https://artistake.tokyo/assets/img/ogp.png" />
      </Head>
      <a href="/">
        <img className="h-12 m-1 ml-2 py-1" src="/assets/img/MetaverStake_logo_white.png" />
      </a>
      <div className="flex justify-end px-4 pt-4 py-2">
        {isConnectWallet && (
          <div className="overflow-hidden">
            {account ? (
              <button className="text-black text-2xs lg:text-sm focus:outline-none">{account}</button>
            ) : (
              <button
                // @ts-ignore:
                onClick={connectWallet}
                className="text-black text-sm focus:outline-none"
              >
                Connect Wallet
              </button>
            )}
          </div>
        )}
        <div>
          <FontAwesomeIcon className="cursor-pointer text-black ml-2 md:ml-8" icon={faBars} onClick={() => setIsNavigationOpen(!isNavigactionOpen)} />
        </div>
      </div>
      {/* {!isNavigactionOpen && (
               <div className="px-4 pt-4 py-2">
                <FontAwesomeIcon
                  className="cursor-pointer text-black ml-2 md:ml-8"
                  icon={faBars}
                  onClick={() => setIsNavigationOpen(!isNavigactionOpen)}
                />
              </div>
      )} */}
      {isNavigactionOpen && (
        <div className="origin-top-right absolute right-0 text-right bg-marimo-1 z-50 bg-opacity-90">
          {navs.map((nav, index) => {
            return (
              <div key={index}>
                {nav.target ? (
                  <a href={nav.to} rel="noreferrer" target="_blank" className="text-black block px-4 py-2 text-sm">
                    {nav.text}
                  </a>
                ) : (
                  <a href={nav.to} className="text-black block px-4 py-2 text-sm">
                    {nav.text}
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Header;
