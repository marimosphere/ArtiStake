import * as React from "react";
import { StakeProps } from "./types";
import { useWallet } from "../../hooks/useWallet";
import { useArtiStake } from "../../hooks/useContract";
import { Contract, ethers } from "ethers";
import axios from "axios";
import { getArtistakeContract, getTipContract } from "../../lib/web3";

import { networkId } from "../../lib/env";
import { Modal } from "../Modal";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const Stake: React.FC<StakeProps> = ({ artistWalletAddress }) => {
  const [connectWallet, account, library] = useWallet();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const [stakers, setStakers] = React.useState([]);
  const [tippers, setTippers] = React.useState([]);

  const [stakeAmount, setStakeAmount] = React.useState("");
  const [depositedAmount, setDepositedAmount] = React.useState("0");
  const [artistTotalStaked, setArtistTotalStaked] = React.useState("0");
  const [apy, setApy] = React.useState("0");
  const stakeContractWithSigner = useArtiStake();
  const stakeContract = getArtistakeContract();
  const tipContract = getTipContract();

  React.useEffect(() => {
    stakeContract.getArtistTotalStaked(artistWalletAddress).then((deposited) => {
      setArtistTotalStaked(ethers.utils.formatEther(deposited.toString()).toString());
    });
    axios
      .get("https://aave-api-v2.aave.com/data/liquidity/v2?poolId=0xd05e3E715d945B59290df0ae8eF85c1BdB684744")
      .then((list) => {
        setApy(list.data[0].liquidityRate);
      });
  }, []);

  React.useEffect(() => {
    if (!account) return;
    stakeContract.getStakerBalanceWithInterest(artistWalletAddress, account).then((deposited) => {
      setDepositedAmount(ethers.utils.formatEther(deposited.toString()).toString());
    });
  }, [account]);

  const refresh = () => {
    stakeContract.getArtistTotalStaked(artistWalletAddress).then((deposited) => {
      setArtistTotalStaked(ethers.utils.formatEther(deposited.toString()).toString());
    });
    stakeContract.getStakerBalanceWithInterest(artistWalletAddress, account).then((deposited) => {
      setDepositedAmount(ethers.utils.formatEther(deposited.toString()).toString());
    });
  };

  const stake = async () => {
    const value = ethers.utils.parseEther(stakeAmount).toString();
    await stakeContractWithSigner.deposit(artistWalletAddress, 0, { value: value });
  };

  const withdraw = async () => {
    stakeContractWithSigner.withdraw(artistWalletAddress);
  };

  const handleStakeAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value) return;
    setStakeAmount(event.target.value);
  };

  const apiBase =
    networkId === 137
      ? "https://api.polygonscan.com/api?module=logs&action=getLogs&fromBlock=0&toBlock=latest"
      : "https://api-testnet.polygonscan.com/api?module=logs&action=getLogs&fromBlock=0&toBlock=latest";
  const getSupporter = async () => {
    const { data: stakeData } = await axios.get(
      `${apiBase}&address=${
        stakeContract.address
      }&topic0=0x8752a472e571a816aea92eec8dae9baf628e840f4929fbcc2d155e6233ff68a7&topic2=0x000000000000000000000000${artistWalletAddress
        .slice(2)
        .toLowerCase()}`
    );
    const { data: tipData } = await axios.get(
      `${apiBase}&address=${
        tipContract.address
      }&topic0=0x0fb1cbde779566d275463551cd9df0b4ac360231b152a4ebdb029dbb20becf6c&topic2=0x000000000000000000000000${artistWalletAddress
        .slice(2)
        .toLowerCase()}`
    );

    const stakerDuplicated = stakeData.result.map((s) => {
      return `0x${s.topics[1].slice(26)}`;
    });

    const staker = [...new Set(stakerDuplicated)];

    const tipperDuplicated = tipData.result.map((t) => {
      return `0x${t.topics[1].slice(26)}`;
    });

    const tipper = [...new Set(tipperDuplicated)];
    setStakers(staker);
    setTippers(tipper);
    setIsModalOpen(true);
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
        <button className="text-white p-2 text-xs" onClick={getSupporter}>
          See Supporter
        </button>
        <Modal isOpen={isModalOpen} close={() => setIsModalOpen(false)}>
          <p className="text-center">Staker</p>
          {stakers.map((staker, i) => {
            return (
              <p key={i} className="text-xs text-center">
                {staker}
              </p>
            );
          })}
          <p className="text-center">Tipper</p>
          {tippers.map((tipper, i) => {
            return (
              <p key={i} className="text-xs text-center">
                {tipper}
              </p>
            );
          })}
        </Modal>
      </div>
      <div className="bg-marimo-3 grid lg:grid-cols-2">
        <div className="m-auto w-2/3 my-8 text-center">
          <div className="mb-2 text-xl">
            <p>Stake on Polygon</p>
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
              {depositedAmount} MATIC
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
