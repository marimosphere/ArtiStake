import * as React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useWeb3React } from "@web3-react/core";
import { injectedConnector } from "../../lib/web3";
import { useWallet } from "../../hooks/useWallet";

const Header = () => {
  const [isNavigactionOpen, setIsNavigationOpen] = React.useState(false);

  const [connectWallet, account, library] = useWallet();

  const navs = [
    { text: "Home", to: "/" },
    { text: "About", to: "/about" },
    { text: "How to get Matic", to: "#" },
    { text: "How to get JPYC", to: "https://app.jpyc.jp/" },
    { text: "Artist Registration", to: "#" },
  ];

  return (
    <div className="bg-marimo-1 w-full">
      <div className="flex justify-end px-4 pt-4 py-2">
        <div>
          {account ? (
            <button className="text-white text-xs lg:text-sm focus:outline-none">{account}</button>
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
        <div>
          <FontAwesomeIcon
            className="cursor-pointer text-white ml-8"
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
                <a href={nav.to} className="text-white block px-4 py-2 text-sm">
                  {nav.text}
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Header;
