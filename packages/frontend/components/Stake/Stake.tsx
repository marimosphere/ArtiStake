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

/* @ts-ignore */
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

    // TODO: Get APY
    setApy("1.2"); // dummy
    // axios
    //   .get("https://aave-api-v2.aave.com/data/liquidity/v2?poolId=0xd05e3E715d945B59290df0ae8eF85c1BdB684744")
    //   .then((list) => {
    //     setApy(list.data[0].liquidityRate);
    //   });
  }, []);

  React.useEffect(() => {
    if (!account) return;
    stakeContract.getStakerBalanceWithInterest(artistWalletAddress, account).then((deposited) => {
      setDepositedAmount(ethers.utils.formatEther(deposited.toString()).toString());
    });
  }, [account]);

  const refresh = () => {
    console.log(stakeContract);
    stakeContract.getArtistTotalStaked(artistWalletAddress).then((deposited) => {
      setArtistTotalStaked(ethers.utils.formatEther(deposited.toString()).toString());
    });

    // TODO: Mock
    stakeContract.getArtistTotalStaked(artistWalletAddress).then((deposited) => {
      // stakeContract.getStakerBalanceWithInterest(artistWalletAddress, account).then((deposited) => {
      setDepositedAmount(ethers.utils.formatEther(deposited.toString()).toString());
    });
  };

  const stake = async () => {
    const value = ethers.utils.parseEther(stakeAmount).toString();
    console.log(value);
    await stakeContractWithSigner.deposit(artistWalletAddress, 0, { value: value });
  };

  const withdraw = async () => {
    stakeContractWithSigner.withdraw(artistWalletAddress);
  };

  const handleStakeAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value) return;
    setStakeAmount(event.target.value);
  };

  // TODO: Supprt Astar
  const getSupporter = async () => {
    setIsModalOpen(true);
  };
  // const apiBase =
  //   networkId === 137
  //     ? "https://api.polygonscan.com/api?module=logs&action=getLogs&fromBlock=0&toBlock=latest"
  //     : "https://api-testnet.polygonscan.com/api?module=logs&action=getLogs&fromBlock=0&toBlock=latest";
  // const getSupporter = async () => {
  //   try {
  //     const { data: stakeData } = await axios.get(
  //       `${apiBase}&address=${
  //         stakeContract.address
  //       }&apikey=13JCDTK8DTRI35R7QWGRNJ2U51JK9HI6SV&topic0=0x8752a472e571a816aea92eec8dae9baf628e840f4929fbcc2d155e6233ff68a7&topic2=0x000000000000000000000000${artistWalletAddress
  //         .slice(2)
  //         .toLowerCase()}`
  //     );

  //     const { data: tipData } = await axios.get(
  //       `${apiBase}&address=${
  //         tipContract.address
  //       }&apikey=M4KQZ482B5UHIAMMUWDQXQW6CZ3FFJ4RY7&topic0=0x0fb1cbde779566d275463551cd9df0b4ac360231b152a4ebdb029dbb20becf6c&topic2=0x000000000000000000000000${artistWalletAddress
  //         .slice(2)
  //         .toLowerCase()}`
  //     );

  //     if (Array.isArray(stakeData.result)) {
  //       const stakerDuplicated = stakeData.result.map((s) => {
  //         return `0x${s.topics[1].slice(26)}`;
  //       });
  //       const staker = [...new Set(stakerDuplicated)];
  //       setStakers(staker);
  //     }

  //     if (Array.isArray(tipData.result)) {
  //       const tipperDuplicated = tipData.result.map((t) => {
  //         return `0x${t.topics[1].slice(26)}`;
  //       });

  //       const tipper = [...new Set(tipperDuplicated)];
  //       setTippers(tipper);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  //  setIsModalOpen(true);
  // };

  return (
    <div className="w-full mx-auto text-white">
      <div className="bg-marimo-2 flex text-center grid lg:grid-cols-3">
        <p className="m-auto p-8 flex-1 text-white text-lg">
          Total Staked <br /> <span className="text-md">{artistTotalStaked} ASTR </span>&nbsp;
          <button onClick={refresh}>
            <img className="pt-1 h-4" src="/assets/img/reload.png" />
          </button>
        </p>
        <p className="m-auto p-8 flex-1 text-white text-lg">
          APY
          <br /> {Number(apy) * 100}%
        </p>
        <div className="flex justify-center items-center">
          <button className="text-white py-2 px-4 rounded-lg text-lg border h-12" onClick={getSupporter}>
            See Supporter
          </button>
        </div>
        <Modal isOpen={isModalOpen} close={() => setIsModalOpen(false)}>
          <p className="text-center">Staker</p>

          {stakers.length > 0 ? (
            <>
              {stakers.map((staker, i) => {
                return (
                  <p key={i} className="text-xs text-center">
                    {staker}
                  </p>
                );
              })}
            </>
          ) : (
            <p className="text-xs text-center">None</p>
          )}
          <p className="text-center">Tipper</p>
          {tippers.length > 0 ? (
            <>
              {tippers.map((tipper, i) => {
                return (
                  <p key={i} className="text-xs text-center">
                    {tipper}
                  </p>
                );
              })}
            </>
          ) : (
            <p className="text-xs text-center">None</p>
          )}
        </Modal>
      </div>
      <div className="bg-marimo-3 grid lg:grid-cols-2">
        <div className="m-auto w-2/3 my-8 text-center">
          <div className="mb-2 text-lg">
            <p>Stake on Astar</p>
          </div>
          <input
            type="number"
            onChange={handleStakeAmount}
            value={stakeAmount}
            placeholder="ASTR"
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
          <div className="mb-1 text-lg">
            <div>Withdraw</div>
          </div>
          <div className="flex mb-2 justify-between">
            <p className="m-auto text-white text-md pl-4">{depositedAmount} ASTR</p>
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
