import * as React from "react";
import { useWallet } from "../../hooks/useWallet";
import { Contract, ethers } from "ethers";
import externalContracts from "../../contracts/external_contracts";
import { TipProps } from "./types";

const Tip: React.FC<TipProps> = ({ artistWalletAddress }) => {
  const [tipStatus, setTipStatus] = React.useState<"approve" | "tip" | "confirm">("approve");
  const [tipAmount, setTipAmount] = React.useState("");
  const [connectWallet, account, library] = useWallet();
  let contract;
  let mockErc20Contract;

  const getAbis = async () => {
    const networkId = process.env.NODE_ENV == "development" ? 4 : 137;
    const address = externalContracts[networkId].contracts.tip.address;
    const abi = externalContracts[networkId].contracts.tip.abi;
    const erc20Address = externalContracts[networkId].contracts.mockErc20.address;
    const erc20Abi = externalContracts[networkId].contracts.mockErc20.abi;
    return { address, abi, erc20Address, erc20Abi };
  };

  const approve = async () => {
    const signer = library.getSigner();
    const signerNetwork = await signer.provider.getNetwork();
    console.log(signerNetwork, "signerNetwork");
    const { address, erc20Address, erc20Abi } = await getAbis();
    mockErc20Contract = new ethers.Contract(erc20Address, erc20Abi, signer);
    const value = ethers.utils.parseEther(tipAmount).toString();
    await mockErc20Contract.approve(address, value);
    setTipStatus("tip");
  };

  const tip = async () => {
    const signer = library.getSigner();
    const { address, abi, erc20Address, erc20Abi } = await getAbis();
    contract = new ethers.Contract(address, abi, signer);
    setTipStatus("confirm");
    const value = ethers.utils.parseEther(tipAmount).toString();
    const result = await contract.tip(erc20Address, artistWalletAddress, value);
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
