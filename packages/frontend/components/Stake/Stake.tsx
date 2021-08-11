import * as React from "react";
import { StakeProps } from "./types";
import { useWallet } from "../../hooks/useWallet";
import { useArtiStake } from "../../hooks/useContract";
import { Contract, ethers } from "ethers";
import axios from "axios";
import { simpleRpcProvider, getArtistakeContract } from "../../lib/web3";

const Stake: React.FC<StakeProps> = ({ artistWalletAddress }) => {
  const [connectWallet, account, library] = useWallet();
  const [stakeAmount, setStakeAmount] = React.useState("");
  const [depositedAmount, setDepositedAmount] = React.useState("0");
  const [artistTotalStaked, setArtistTotalStaked] = React.useState("0");
  const [apy, setApy] = React.useState("0");
  const stakeContractWithSigner = useArtiStake();
  const stakeContract = getArtistakeContract();

  React.useEffect(() => {
    if (!library) return;
    refresh();
  }, [library]);

  React.useEffect(() => {
    axios
      .get("https://aave-api-v2.aave.com/data/liquidity/v2?poolId=0xd05e3E715d945B59290df0ae8eF85c1BdB684744")
      .then((list) => {
        setApy(list.data[0].liquidityRate);
      });
    stakeContract.getArtistTotalStaked(artistWalletAddress).then((deposited) => {
      setArtistTotalStaked(ethers.utils.formatEther(deposited.toString()).toString());
    });
  }, []);

  const stake = async () => {
    console.log("stake");

    const value = ethers.utils.parseEther(stakeAmount).toString();
    await stakeContractWithSigner.deposit(artistWalletAddress, 0, { value: value });
  };

  const withdraw = async () => {
    stakeContractWithSigner.withdraw(artistWalletAddress);
  };

  const refresh = () => {
    stakeContract.getStakerBalanceWithInterest(artistWalletAddress, account).then((deposited) => {
      console.log(deposited);
      setDepositedAmount(ethers.utils.formatEther(deposited.toString()).toString());
    });

    stakeContract.getArtistTotalStaked(artistWalletAddress).then((deposited) => {
      setArtistTotalStaked(ethers.utils.formatEther(deposited.toString()).toString());
    });

    axios
      .get("https://aave-api-v2.aave.com/data/liquidity/v2?poolId=0xd05e3E715d945B59290df0ae8eF85c1BdB684744")
      .then((list) => {
        setApy(list.data[0].liquidityRate);
      });
  };

  const handleStakeAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value) return;
    setStakeAmount(event.target.value);
  };

  return (
    <div className="w-full mx-auto text-white">
      <div className="bg-marimo-2 flex text-center grid lg:grid-cols-3">
        <p className="m-auto p-8 flex-1 text-white text-2xl">
          Total Staked <br /> {artistTotalStaked} MATIC
        </p>
        <p className="m-auto p-8 flex-1 text-white text-2xl">
          APY
          <br /> {Number(apy) * 100}%
        </p>
        {/* <p className="m-auto p-8 flex-1 text-white text-2xl">
          Reward
          <br /> 52,456 MATIC
        </p> */}
      </div>
      <div className="bg-marimo-3 grid lg:grid-cols-2">
        <div className="m-auto w-2/3 my-8 text-center">
          <div className="mb-2 text-xl">
            <p>Stake</p>
          </div>
          <input
            type="number"
            onChange={handleStakeAmount}
            value={stakeAmount}
            placeholder="MATIC"
            className="h-10 mb-2 w-2/3 border-2 pr-2 border-marimo-5 text-black text-right rounded-lg "
          />
          {!account ? (
            // @ts-ignore:
            <button onClick={connectWallet} className="h-10 w-2/3 bg-marimo-5 rounded-lg hover:opacity-75">
              Connect Wallet
            </button>
          ) : (
            <button onClick={stake} className="h-10 w-2/3 bg-marimo-5 rounded-lg hover:opacity-75">
              Stake
            </button>
          )}
        </div>
        <div className="w-2/3 m-auto my-8 text-center">
          <div className="mb-2 text-xl">
            <div>Withdraw</div>
          </div>
          <div className="flex mb-2 justify-between">
            <p className="m-auto text-white lg:text-2xl pl-4">
              {depositedAmount} MATIC{" "}
              <button onClick={refresh}>
                <img className="h-7" src="/assets/img/reload.png" />
              </button>
            </p>
          </div>
          {!account ? (
            // @ts-ignore:
            <button onClick={connectWallet} className="h-10 w-2/3 bg-marimo-5 rounded-lg hover:opacity-75">
              Connect Wallet
            </button>
          ) : (
            <button onClick={withdraw} className="h-10 w-2/3 bg-marimo-5 rounded-lg hover:opacity-75">
              Withdraw
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stake;
