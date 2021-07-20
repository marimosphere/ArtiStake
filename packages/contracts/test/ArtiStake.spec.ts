import hre, { ethers } from "hardhat";
import * as chai from "chai";
import { solidity } from "ethereum-waffle";
import {
  POLYGON_WETH_ADDRESS,
  POLYGON_AAVE_LENDING_POOL_ADDRESS,
  POLYGON_AAVE_WETH_GATEWAY_ADDRESS,
  POLYGON_AAVE_WETH_ATOKEN_ADDRESS,
} from "../lib/constants";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

chai.use(solidity);
const { expect } = chai;

describe("ArtiStake", function () {
  let artiStakeContract: any;
  let signer: SignerWithAddress;
  let stakerA: SignerWithAddress;
  let stakerB: SignerWithAddress;
  let artistA: SignerWithAddress;
  let artistB: SignerWithAddress;
  this.beforeEach(async function () {
    [signer, stakerA, stakerB, artistA, artistB] = await ethers.getSigners();
    const ArtiStake = await ethers.getContractFactory("ArtiStake");
    artiStakeContract = await ArtiStake.deploy(
      POLYGON_AAVE_LENDING_POOL_ADDRESS,
      POLYGON_AAVE_WETH_GATEWAY_ADDRESS,
      POLYGON_WETH_ADDRESS
    );
  });

  it("User can stake to Artist", async function () {
    const balanceBefore = await ethers.provider.getBalance(artiStakeContract.address);
    expect(balanceBefore).to.equal(0);
    const balanceATokenBefore = await artiStakeContract.getAtokenScaledBalance(POLYGON_AAVE_WETH_ATOKEN_ADDRESS);
    expect(balanceATokenBefore).to.equal(0);
    await artiStakeContract.connect(stakerA).deposit(artistA.address, 0, { value: 100000000000000 });
    const balanceATokenAfter = await artiStakeContract.getAtokenScaledBalance(POLYGON_AAVE_WETH_ATOKEN_ADDRESS);
    const userBalanceBefore = await artiStakeContract
      .connect(stakerA)
      .getStakerBalanceWithInterest(artistA.address, stakerA.address);
    expect(balanceATokenAfter).to.be.above(0);
    await ethers.provider.send("evm_increaseTime", [31536000]);
    await ethers.provider.send("evm_mine", []);
    const userBalanceAfter = await artiStakeContract
      .connect(stakerA)
      .getStakerBalanceWithInterest(artistA.address, stakerA.address);
    expect(userBalanceAfter).to.be.above(userBalanceBefore);
  });

  it("User can withdraw 全額", async function () {
    await artiStakeContract.connect(stakerA).deposit(artistA.address, 0, { value: 1000000000000000 });
    await ethers.provider.send("evm_increaseTime", [31536000]);
    await ethers.provider.send("evm_mine", []);
    const artistBalanceBefore = await ethers.provider.getBalance(artistA.address);
    const stakerBalanceBefore = await ethers.provider.getBalance(stakerA.address);
    await artiStakeContract.connect(stakerA).withdraw(artistA.address);
    // 全額引き出せているか？
    const stakerStakingBalance = await artiStakeContract
      .connect(stakerA)
      .getStakerBalanceWithInterest(artistA.address, stakerA.address);
    expect(stakerStakingBalance).to.equal(0);
    const artistBalanceAfter = await ethers.provider.getBalance(artistA.address);
    const stakerBalanceAfter = await ethers.provider.getBalance(stakerA.address);
    expect(artistBalanceAfter).to.be.above(artistBalanceBefore);
    expect(stakerBalanceBefore).to.be.above(stakerBalanceAfter);
  });

  it("Staker cannot withdraw other's balance", async function () {
    await artiStakeContract.connect(stakerA).deposit(artistA.address, 0, { value: 1000000000000000 });
    await expect(artiStakeContract.connect(stakerB).withdraw(artistA.address)).to.revertedWith(
      "currently not deposited"
    );
  });

  it("Multiple staker can withdraw", async function () {
    // stakerA deposit
    await artiStakeContract.connect(stakerA).deposit(artistA.address, 0, { value: 1000000000000000 });
    // stakerB deposit
    await artiStakeContract.connect(stakerB).deposit(artistA.address, 0, { value: 1000000000000000 });
    await ethers.provider.send("evm_increaseTime", [31536000]);
    await ethers.provider.send("evm_mine", []);
    // stakerB withdraw
    const balanceAToken1 = await artiStakeContract.getAtokenScaledBalance(POLYGON_AAVE_WETH_ATOKEN_ADDRESS);
    await artiStakeContract.connect(stakerB).withdraw(artistA.address);
    const balanceAToken2 = await artiStakeContract.getAtokenScaledBalance(POLYGON_AAVE_WETH_ATOKEN_ADDRESS);
    // stakerA withdraw
    await artiStakeContract.connect(stakerA).withdraw(artistA.address);
    const balanceAToken3 = await artiStakeContract.getAtokenScaledBalance(POLYGON_AAVE_WETH_ATOKEN_ADDRESS);
    // ArtiStakeのコントラクトのbalanceが下がっていることの確認
    expect(balanceAToken1).to.be.above(balanceAToken2);
    expect(balanceAToken2).to.be.above(balanceAToken3);
  });

  it("staker cannot withdraw other artists", async function () {
    // userA deposit to artistA
    await artiStakeContract.connect(stakerA).deposit(artistA.address, 0, { value: 1000000000000000 });
    // userB deposit to artistB
    await artiStakeContract.connect(stakerB).deposit(artistB.address, 0, { value: 1000000000000000 });
    await ethers.provider.send("evm_increaseTime", [31536000]);
    await ethers.provider.send("evm_mine", []);
    // userA withdraw of artistB
    await expect(artiStakeContract.connect(stakerA).withdraw(artistB.address)).to.revertedWith(
      "currently not deposited"
    );
  });

  it("staker can deposit and withdraw to multiple artists", async function () {
    // userA deposit to artistA
    await artiStakeContract.connect(stakerA).deposit(artistA.address, 0, { value: 1000000000000000 });
    // userA deposit to artistB
    await artiStakeContract.connect(stakerA).deposit(artistB.address, 0, { value: 1000000000000000 });
    await ethers.provider.send("evm_increaseTime", [31536000]);
    await ethers.provider.send("evm_mine", []);
    // userA withdraw of artistA
    const artistABalanceBefore = await ethers.provider.getBalance(artistA.address);
    await artiStakeContract.connect(stakerA).withdraw(artistA.address);
    const artistABalanceAfter = await ethers.provider.getBalance(artistA.address);
    expect(artistABalanceAfter).to.be.above(artistABalanceBefore);
    // userA withdraw of artistB
    const artistBBalanceBefore = await ethers.provider.getBalance(artistB.address);
    await artiStakeContract.connect(stakerA).withdraw(artistB.address);
    const artistBBalanceAfter = await ethers.provider.getBalance(artistB.address);
    expect(artistBBalanceAfter).to.be.above(artistBBalanceBefore);
  });

  it("can get artist staked amount", async function () {
    await artiStakeContract.connect(stakerA).deposit(artistA.address, 0, { value: 1000000000000000 });
    // userA deposit to artistB
    await artiStakeContract.connect(stakerB).deposit(artistA.address, 0, { value: 1000000000000000 });
    const artistTotalStaked = await artiStakeContract.connect(stakerA).getArtistTotalStaked(artistA.address);
    expect(artistTotalStaked).to.be.above(2000000000000000);
    await artiStakeContract.connect(stakerA).withdraw(artistA.address);
    await artiStakeContract.connect(stakerB).withdraw(artistA.address);
    const artistTotalStaked2 = await artiStakeContract.connect(stakerA).getArtistTotalStaked(artistA.address);
    expect(artistTotalStaked2).to.equal(0);
  });

  it("not owner signer cannot update artistInterestRatio", async function () {
    await expect(artiStakeContract.connect(stakerA).updateArtistInterestRatio(300)).to.revertedWith(
      "Ownable: caller is not the owner"
    );
  });
  it("cannot set artistInterestRatio higher than 10000", async function () {
    const base = await artiStakeContract.interestRatioBase();
    const artiStakeFeeRatio = await artiStakeContract.artiStakeFeeRatio();
    await expect(artiStakeContract.connect(signer).updateArtistInterestRatio(base - artiStakeFeeRatio)).to.revertedWith(
      "ratio + artiStakeFeeRatio must be smaller than base"
    );
  });
  it("can set artistInterestRatio", async function () {
    const changedRatio = 300;
    await artiStakeContract.connect(signer).updateArtistInterestRatio(changedRatio);
    expect(await artiStakeContract.artistInterestRatio()).to.equal(changedRatio);
  });
  it("not owner signer cannot update artistInterestRatio", async function () {
    await expect(artiStakeContract.connect(stakerA).updateArtiStakeFeeRatio(300)).to.revertedWith(
      "Ownable: caller is not the owner"
    );
  });
  it("cannot set artiStakeFeeRatio higher than 10000", async function () {
    const base = await artiStakeContract.interestRatioBase();
    const artistInterestRatio = await artiStakeContract.artistInterestRatio();
    await expect(artiStakeContract.connect(signer).updateArtiStakeFeeRatio(base - artistInterestRatio)).to.revertedWith(
      "ratio + artistInterestRatio must be smaller than base"
    );
  });
  it("can set artiStakeFeeRatio", async function () {
    const changedRatio = 300;
    await artiStakeContract.connect(signer).updateArtiStakeFeeRatio(changedRatio);
    expect(await artiStakeContract.artiStakeFeeRatio()).to.equal(changedRatio);
  });
});
