import * as React from "react";
import { ArtistWorksProps } from "./types";

const Stake = () => {
  return (
    <div className="w-full mx-auto text-white">
      <div className="h-20 bg-marimo-2 flex text-center">
        <p className="m-auto flex-1 text-white text-5xl">TVL:3000JPYC</p>
        <p className="m-auto flex-1 text-white text-5xl">APY 888%</p>
        <p className="m-auto flex-1 text-white text-5xl">Reward 500JPYC</p>
      </div>
      <div className="h-20 bg-marimo-3 flex">
        <div className="m-auto text-center flex-1">
          <p>Stake</p>
          <p>Wallet Balance: 100</p>
          <input type="number" className="w-3/5 border-2 border-blue-200" />
          <button>Stake</button>
        </div>
        <div className="m-auto text-center flex-1">
          <p>Withdraw</p>
          <p>Your Staked: 000</p>
          <input type="number" className="w-3/5 border-2 border-coolGray-600" />
          <button>Withdraw</button>
        </div>
      </div>
    </div>
  );
};

export default Stake;
