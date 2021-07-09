import * as React from "react";
import { ArtistWorksProps } from "./types";
import { useWallet } from "../../hooks/useWallet";
import { Contract, ethers } from "ethers";
import externalContracts from "../../contracts/external_contracts";

const Tip = () => {
  const [tipStatus, setTipStatus] = React.useState<"approve" | "tip" | "confirm">("approve");
  const [connectWallet, account, library] = useWallet();

  const approve = () => {
    const address = externalContracts[4].contracts.tip.address;
    const abi = externalContracts[4].contracts.tip.abi;
    const signer = library.getSigner();
    const contract = new ethers.Contract(address, abi, signer);
    setTipStatus("tip");
    console.log(contract);
    contract.tip(
      "0xbd9c419003a36f187daf1273fce184e1341362c0",
      "0x67B6cB5502C1e24095e1868309dF33F09Deec0F1",
      1000000000000000
    );
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
