import * as React from "react";
import { useWallet } from "../../hooks/useWallet";
import { useTip, useJpyc } from "../../hooks/useContract";
import { Contract, ethers } from "ethers";
import externalContracts from "../../contracts/external_contracts";
import { TipProps } from "./types";

const Tip: React.FC<TipProps> = ({ artistWalletAddress }) => {
  const [tipStatus, setTipStatus] = React.useState<"approve" | "tip" | "confirm">("approve");
  const [tipAmount, setTipAmount] = React.useState("");
  const [explorer, setExplorer] = React.useState("");
  const [connectWallet, account, library] = useWallet();
  const tipContract = useTip();
  const jpycContract = useJpyc();

  const approve = async () => {
    const value = ethers.utils.parseEther(tipAmount).toString();
    await jpycContract.approve(tipContract.address, value);
    setTipStatus("tip");
  };

  const tip = async () => {
    setTipStatus("confirm");
    const value = ethers.utils.parseEther(tipAmount).toString();
    const { hash: tx } = await tipContract.tip(jpycContract.address, artistWalletAddress, value);
    setExplorer(`https://polygonscan.com/tx/${tx}`);
    console.log(tx);
  };

  const handleTipAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value) return;
    setTipAmount(event.target.value);
  };

  return (
    <div className="w-full mx-auto">
      <img className="mx-auto h-40 object-cover mb-8" src="/assets/img/jpyc.png" />
      {!account ? (
        <div className="text-center">
          <button
            // @ts-ignore:
            onClick={connectWallet}
            className="w-40 h-8 bg-marimo-5 hover:opacity-75 text-white font-bold rounded-lg "
          >
            connectWallet
          </button>
        </div>
      ) : tipStatus === "approve" ? (
        <div className="text-center">
          <input
            onChange={handleTipAmount}
            value={tipAmount}
            type="number"
            placeholder="JPYC"
            className="h-8 rounded-l-lg text-right border-2 border-marimo-5 pr-2"
          />
          <button onClick={approve} className="w-24 h-8 bg-marimo-5 hover:opacity-75 text-white font-bold rounded-r-lg">
            Approve
          </button>
        </div>
      ) : tipStatus === "tip" ? (
        <div className="text-center">
          <p className="text-white  text-base text-center">{tipAmount} JPYC</p>
          <button onClick={tip} className="w-24 h-8 bg-marimo-5 text-white font-bold rounded-lg">
            Tip
          </button>
        </div>
      ) : (
        <div className="">
          <p className="text-white  text-base text-center">
            Thank you!{" "}
            <a href={explorer} className="underline">
              Receipt
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default Tip;
