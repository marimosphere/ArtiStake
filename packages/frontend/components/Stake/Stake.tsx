import * as React from "react";
import { ArtistWorksProps } from "./types";

const Stake = () => {
  return (
    <div className="w-full mx-auto text-white">
      <div className="h-20 bg-marimo-2 flex text-center">
        <p className="m-auto flex-1 text-white text-2xl">
          Toatal Staking Value <br /> 1,234,567,890 MATIC
        </p>
        <p className="m-auto flex-1 text-white text-2xl">APY: 888%</p>
        <p className="m-auto flex-1 text-white text-2xl">Reward: 52,456 MATIC</p>
      </div>
      <div className="h-28 bg-marimo-3 flex">
        <div className="m-auto w-2/5 text-center  justify-around">
          <div className="mb-2 flex justify-between">
            <p>Stake</p>
            <p>Wallet Balance: 100</p>
          </div>
          <input type="number" className="h-10 w-4/5 border-2 border-marimo-5 rounded-l-lg text-black text-right" />
          <button className="h-10 w-1/5 bg-marimo-5 rounded-r-lg hover:opacity-75">Stake</button>
        </div>
        <div className="m-auto w-2/5 text-center  justify-around">
          <div className="mb-2 flex justify-between">
            <div>Withdraw</div>
            <div>Your Staked: 000</div>
          </div>
          <input type="number" className="w-4/5 h-10 border-2 border-marimo-6 rounded-l-lg text-black text-right" />
          <button className="h-10 w-1/5 bg-marimo-6 rounded-r-lg hover:opacity-75">Withdraw</button>
        </div>
      </div>
    </div>
  );
};

export default Stake;
