import * as React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const [isNavigactionOpen, setIsNavigationOpen] = React.useState(false);
  const [isWalletConnected, setWalletConnected] = React.useState(false);

  const navs = [
    { text: "Home", to: "/" },
    { text: "About", to: "/about" },
    { text: "Buy Matic", to: "#" },
    { text: "Artist Registration", to: "#" },
  ];

  return (
    <div className="bg-marimo-1">
      <div className="flex justify-end px-4 pt-4 py-2">
        <div>
          {isWalletConnected ? (
            <button className="text-white text-sm focus:outline-none">0x0000...0000</button>
          ) : (
            <button
              onClick={() => setWalletConnected(!isWalletConnected)}
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
