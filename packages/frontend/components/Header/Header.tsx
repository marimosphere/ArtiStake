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
    // { text: "How to get Matic", to: "#", target: true },
    { text: "How to get JPYC", to: "https://app.jpyc.jp/", target: true },
    {
      text: "Artist Registration",
      to: "https://docs.google.com/forms/d/e/1FAIpQLSeQmx1eeEfVFtSa14i1WtAtyAspm21ejuz54g1TEnoOr-OrFw/viewform?usp=sf_link",
      target: true,
    },
  ];

  return (
    <div className="flex justify-between bg-marimo-1 w-full">
      <Head>
        <title>ArtiStake - Artist Staking Platform</title>
        <meta name="viewport" content="width=device-width" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="og:url" content="https://artistake.tokyo.app" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="ArtiStake - Artist Staking Platform" />
        <meta property="og:description" content=" ArtiStake supports artists by staking tokens" />
        <meta property="og:site_name" content="ArtiStake" />
        <meta property="og:image" content="https://artistake.tokyo/assets/img/ogp.png" />
      </Head>
      <a href="/">
        <img className="h-12 m-2" src="/assets/img/hero.png" />
      </a>
      <div className="flex justify-end px-4 pt-4 py-2">
        {isConnectWallet && (
          <div className="overflow-hidden">
            {account ? (
              <button className="text-white text-2xs lg:text-sm focus:outline-none">{account}</button>
            ) : (
              <button
                // @ts-ignore:
                onClick={connectWallet}
                className="text-white text-sm focus:outline-none"
              >
                Connect Wallet
              </button>
            )}
          </div>
        )}
        <div>
          <FontAwesomeIcon
            className="cursor-pointer text-white ml-2 md:ml-8"
            icon={faBars}
            onClick={() => setIsNavigationOpen(!isNavigactionOpen)}
          />
        </div>
      </div>
      {isNavigactionOpen && (
        <div className="origin-top-right absolute right-0 text-right bg-marimo-1">
          {navs.map((nav, index) => {
            return (
              <div key={index}>
                {nav.target ? (
                  <a href={nav.to} rel="noreferrer" target="_blank" className="text-white block px-4 py-2 text-sm">
                    {nav.text}
                  </a>
                ) : (
                  <a href={nav.to} className="text-white block px-4 py-2 text-sm">
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
