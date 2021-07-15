import * as React from "react";
import { StakeProps } from "./types";
import { useWallet } from "../../hooks/useWallet";
import externalContracts from "../../contracts/external_contracts";
import { Contract, ethers } from "ethers";

const Stake: React.FC<StakeProps> = ({ artistWalletAddress }) => {
  const [connectWallet, account, library] = useWallet();
  const [stakeAmount, setStakeAmount] = React.useState("");
  const [depositedAmount, setDepositedAmount] = React.useState("");

  React.useEffect(() => {
    if (!library) return;
    refresh();
  }, [library]);

  const getStakeContract = () => {
    const signer = library.getSigner();
    const { stakeContractAddress, stakeContractAbi } = getAbis();
    const stakeContract = new ethers.Contract(stakeContractAddress, stakeContractAbi, signer);
    return stakeContract;
  };

  const stake = async () => {
    console.log("stake");
    const stakeContract = getStakeContract();
    const value = ethers.utils.parseEther(stakeAmount).toString();
    await stakeContract.deposit(artistWalletAddress, 0, { value: value });
  };

  const withdraw = async () => {
    console.log("withdraw");
    const stakeContract = getStakeContract();
    stakeContract.withdraw(artistWalletAddress);
  };

  const refresh = () => {
    console.log("refresh");
    const stakeContract = getStakeContract();
    stakeContract.getStakerBalanceWithInterest(artistWalletAddress).then((deposited) => {
      setDepositedAmount(ethers.utils.formatEther(deposited.toString()).toString());
    });
  };

  const handleStakeAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value) return;
    setStakeAmount(event.target.value);
  };

  const getAbis = () => {
    const networkId = process.env.NODE_ENV == "development" ? 4 : 137;
    const stakeContractAddress = externalContracts[networkId].contracts.stake.address;
    const stakeContractAbi = externalContracts[networkId].contracts.stake.abi;
    return { stakeContractAddress, stakeContractAbi };
  };
  return (
    <div className="w-full mx-auto text-white">
      <div className="h-20 bg-marimo-2 flex text-center">
        <p className="m-auto flex-1 text-white text-2xl">
          Toatal Staking Value <br /> 1,234,567,890 MATIC
        </p>
        <p className="m-auto flex-1 text-white text-2xl">APY: 888%</p>
        <p className="m-auto flex-1 text-white text-2xl">Reward: 52,456 MATIC</p>
      </div>
      <div className="bg-marimo-3 flex">
        <div className="m-auto my-16 w-2/5 text-center justify-around">
          <div className="mb-2 flex justify-between">
            <p>Stake</p>
          </div>
          <input
            type="number"
            onChange={handleStakeAmount}
            value={stakeAmount}
            placeholder="MATIC"
            className="h-10 w-3/4 border-2 pr-2 border-marimo-5 rounded-l-lg text-black text-right"
          />
          <button onClick={stake} className="h-10 w-1/4 bg-marimo-5 rounded-r-lg hover:opacity-75">
            Stake
          </button>
        </div>
        <div className="m-auto my-16 w-2/5 text-center  justify-around">
          <div className="mb-2 flex justify-between">
            <div>Withdraw</div>
          </div>
          <div className="flex justify-between">
            <div className="w-3/5 flex">
              <p className="m-auto text-white text-2xl">Your Staked: {depositedAmount} MATIC</p>
              <button onClick={refresh} className="rounded-lg hover:opacity-75">
                <p className="text-2xl">🔄</p>
              </button>
            </div>
            <button onClick={withdraw} className="h-10 w-1/4 bg-marimo-5 rounded-lg hover:opacity-75">
              Withdraw
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stake;
