import * as React from "react";
import { ArtistWorksProps } from "./types";
import { useWallet } from "../../hooks/useWallet";

const Tip = () => {
  const [tipStatus, setTipStatus] = React.useState<"approve" | "tip" | "confirm">("approve");
  const [connectWallet, account, library] = useWallet();

  const approve = () => {
    setTipStatus("tip");
  };

  const tip = () => {
    setTipStatus("confirm");
  };

  return (
    <div className="w-full mx-auto">
      <img className="mx-auto h-40 object-cover mb-8" src="/assets/img/jpyc.png" />
      {!account ? (
        <button onClick={connectWallet}>connectWallet</button>
      ) : tipStatus === "approve" ? (
        <div className="text-center">
          <input type="number" className="h-8 rounded-l-lg text-right border-2 border-marimo-5" />
          <button
            onClick={approve}
            className="w-24 h-8 bg-marimo-5  hover:opacity-75 text-white font-bold rounded-r-lg"
          >
            Approve
          </button>
        </div>
      ) : tipStatus === "tip" ? (
        <div className="text-center">
          <input type="number" className="h-8 rounded-l-lg text-right border-2 border-marimo-5" />
          <button onClick={tip} className="w-24 h-8 bg-marimo-5 hover:opacity-75 text-white font-bold rounded-r-lg">
            Tip
          </button>
        </div>
      ) : (
        <div className="">
          <p className="text-white  text-base text-center">
            Thank you!{" "}
            <a href="#" className="underline">
              Receipt
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default Tip;
