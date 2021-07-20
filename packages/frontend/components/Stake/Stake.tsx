import * as React from "react";
import { StakeProps } from "./types";
import { useWallet } from "../../hooks/useWallet";
import { useArtiStake } from "../../hooks/useContract";
import { Contract, ethers } from "ethers";
import { useQuery, gql } from "@apollo/client";

const Stake: React.FC<StakeProps> = ({ artistWalletAddress }) => {
  const [connectWallet, account, library] = useWallet();
  const [stakeAmount, setStakeAmount] = React.useState("");
  const [depositedAmount, setDepositedAmount] = React.useState("0");
  const [artistTotalStaked, setArtistTotalStaked] = React.useState("0");
  const stakeContract = useArtiStake();

  React.useEffect(() => {
    if (!library) return;

    refresh();
  }, [library]);

  const stake = async () => {
    console.log("stake");

    const value = ethers.utils.parseEther(stakeAmount).toString();
    await stakeContract.deposit(artistWalletAddress, 0, { value: value });
  };

  const withdraw = async () => {
    console.log("withdraw");
    stakeContract.withdraw(artistWalletAddress);
  };

  const refresh = () => {
    console.log("refresh");
    console.log(account);
    stakeContract.getStakerBalanceWithInterest(artistWalletAddress, account).then((deposited) => {
      console.log(deposited);
      setDepositedAmount(ethers.utils.formatEther(deposited.toString()).toString());
    });

    stakeContract.getArtistTotalStaked(artistWalletAddress).then((deposited) => {
      console.log(deposited);
      setArtistTotalStaked(ethers.utils.formatEther(deposited.toString()).toString());
    });
  };

  const handleStakeAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value) return;
    setStakeAmount(event.target.value);
  };

  const LIQUIDITY_RATES = gql`
    query {
      reserves(where: { name: "Wrapped Matic" }) {
        id
        name
        liquidityRate
      }
    }
  `;

  function APY() {
    const { loading, error, data } = useQuery(LIQUIDITY_RATES);

    if (loading) return <p className="m-auto p-4 flex-1 text-white text-2xl">Loading...</p>;
    if (error) return <p className="m-auto p-4 flex-1 text-white text-2xl">Error</p>;

    return (
      <p className="m-auto p-4 flex-1 text-white text-2xl">
        APY
        <br /> {data.reserves[0].liquidityRate / 100000000000000000000000000}%
      </p>
    );
  }

  return (
    <div className="w-full mx-auto text-white">
      <div className="bg-marimo-2 flex text-center grid lg:grid-cols-3">
        <p className="m-auto p-4 flex-1 text-white text-2xl">
          Toatal Staked <br /> {artistTotalStaked} MATIC
        </p>
        <APY />
        {/* <p className="m-auto p-4 flex-1 text-white text-2xl">
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
            className="h-10 mb-2 w-2/3 border-2 pr-2 border-marimo-5 text-black text-right"
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
          <div className="flex mb-2">
            <p className="m-auto text-white lg:text-2xl">{depositedAmount} MATIC</p>
            <button onClick={refresh}>
              <p className="text-2xl">🔄</p>
            </button>
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
