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
  let notArtist: SignerWithAddress;
  this.beforeEach(async function () {
    [signer, stakerA, stakerB, artistA, artistB, notArtist] = await ethers.getSigners();
    const ArtiStake = await ethers.getContractFactory("ArtiStake");
    artiStakeContract = await ArtiStake.deploy(
      POLYGON_AAVE_LENDING_POOL_ADDRESS,
      POLYGON_AAVE_WETH_GATEWAY_ADDRESS,
      POLYGON_WETH_ADDRESS
    );
    await artiStakeContract.registerToArtistlist(artistA.address);
    await artiStakeContract.registerToArtistlist(artistB.address);
  });

  it("User can stake to Artist", async function () {
    const balanceBefore = await ethers.provider.getBalance(artiStakeContract.address);
    expect(balanceBefore).to.equal(0);
    const balanceATokenBefore = await artiStakeContract.getAtokenScaledBalance(POLYGON_AAVE_WETH_ATOKEN_ADDRESS);
    expect(balanceATokenBefore).to.equal(0);
    await artiStakeContract.connect(stakerA).deposit(artistA.address, 0, { value: 100000000000000 });
    const b = await artiStakeContract.connect(stakerA).getStakerBalanceWithInterest(artistA.address);
    console.log(b, "b");
    const balanceAfter = await ethers.provider.getBalance(artiStakeContract.address);
    expect(balanceAfter).to.equal(0);
    const balanceATokenAfter = await artiStakeContract.getAtokenScaledBalance(POLYGON_AAVE_WETH_ATOKEN_ADDRESS);
    expect(balanceATokenAfter).to.be.above(0);
    await ethers.provider.send("evm_increaseTime", [31536000]);
    const c = await artiStakeContract.connect(stakerA).getStakerBalanceWithInterest(artistA.address);
    console.log(c, "c");
  });

  it("User can withdraw 全額", async function () {
    await artiStakeContract.connect(stakerA).deposit(artistA.address, 0, { value: 1000000000000000 });
    await ethers.provider.send("evm_increaseTime", [31536000]);
    const artistBalanceBefore = await ethers.provider.getBalance(artistA.address);
    const stakerBalanceBefore = await ethers.provider.getBalance(stakerA.address);
    await artiStakeContract.connect(stakerA).withdraw(artistA.address, 1000000000000000);
    const balanceAToken = await artiStakeContract.getAtokenScaledBalance(POLYGON_AAVE_WETH_ATOKEN_ADDRESS);
    expect(balanceAToken).to.be.above(0);
    const artistBalanceAfter = await ethers.provider.getBalance(artistA.address);
    const stakerBalanceAfter = await ethers.provider.getBalance(stakerA.address);
    expect(artistBalanceAfter).to.be.above(artistBalanceBefore);
  });

  it("User can withdraw 一部", async function () {
    await artiStakeContract.connect(stakerA).deposit(artistA.address, 0, { value: 1000000000000000 });
    await ethers.provider.send("evm_increaseTime", [31536000]);
    const artistBalanceBefore = await ethers.provider.getBalance(artistA.address);
    const stakerBalanceBefore = await ethers.provider.getBalance(stakerA.address);
    await artiStakeContract.connect(stakerA).withdraw(artistA.address, 1000000000000);
    const balanceAToken = await artiStakeContract.getAtokenScaledBalance(POLYGON_AAVE_WETH_ATOKEN_ADDRESS);
    expect(balanceAToken).to.be.above(0);
    const artistBalanceAfter = await ethers.provider.getBalance(artistA.address);
    const stakerBalanceAfter = await ethers.provider.getBalance(stakerA.address);
    expect(artistBalanceAfter).to.be.above(artistBalanceBefore);
    console.log(artistBalanceAfter.sub(artistBalanceBefore));
  });

  it("User Cannot withdraw other's balance", async function () {
    // stakerA deposit
    await artiStakeContract.connect(stakerA).deposit(artistA.address, 0, { value: 1000000000000000 });
    await ethers.provider.send("evm_increaseTime", [31536000]);
    // stakerB deposit
    await artiStakeContract.connect(stakerB).deposit(artistA.address, 0, { value: 1000000000000000 });
    await ethers.provider.send("evm_increaseTime", [31536000]);
    // stakerA withdraw
    await expect(artiStakeContract.connect(stakerA).withdraw(artistA.address, 2000000000000000)).to.revertedWith(
      "not enough deposited balance"
    );
  });

  it("Multiple User can withdraw", async function () {
    // stakerA deposit
    await artiStakeContract.connect(stakerA).deposit(artistA.address, 0, { value: 1000000000000000 });
    await ethers.provider.send("evm_increaseTime", [31536000]);
    // stakerB deposit
    await artiStakeContract.connect(stakerB).deposit(artistA.address, 0, { value: 1000000000000000 });
    await ethers.provider.send("evm_increaseTime", [31536000]);
    // stakerB withdraw
    const balanceAToken1 = await artiStakeContract.getAtokenScaledBalance(POLYGON_AAVE_WETH_ATOKEN_ADDRESS);
    await artiStakeContract.connect(stakerB).withdraw(artistA.address, 1000000000000000);
    const balanceAToken2 = await artiStakeContract.getAtokenScaledBalance(POLYGON_AAVE_WETH_ATOKEN_ADDRESS);
    // stakerA withdraw
    await artiStakeContract.connect(stakerA).withdraw(artistA.address, 1000000000000000);
    const balanceAToken3 = await artiStakeContract.getAtokenScaledBalance(POLYGON_AAVE_WETH_ATOKEN_ADDRESS);
    expect(balanceAToken1).to.be.above(balanceAToken2);
    expect(balanceAToken2).to.be.above(balanceAToken3);
  });

  it("staker cannot withdraw other artists", async function () {
    // userA deposit to artistA
    await artiStakeContract.connect(stakerA).deposit(artistA.address, 0, { value: 1000000000000000 });
    await ethers.provider.send("evm_increaseTime", [31536000]);
    // userA deposit to artistB
    await artiStakeContract.connect(stakerA).deposit(artistB.address, 0, { value: 1000000000000000 });
    await ethers.provider.send("evm_increaseTime", [31536000]);
    // userA withdraw of artistA
    await expect(artiStakeContract.connect(stakerA).withdraw(artistA.address, 2000000000000000)).to.revertedWith(
      "not enough deposited balance"
    );
    // userA withdraw of artistB
  });

  it("staker can deposit and withdraw to multiple artists", async function () {
    // userA deposit to artistA
    await artiStakeContract.connect(stakerA).deposit(artistA.address, 0, { value: 1000000000000000 });
    await ethers.provider.send("evm_increaseTime", [31536000]);
    // userA deposit to artistB
    await artiStakeContract.connect(stakerA).deposit(artistB.address, 0, { value: 1000000000000000 });
    await ethers.provider.send("evm_increaseTime", [31536000]);
    // userA withdraw of artistA
    await artiStakeContract.connect(stakerA).withdraw(artistA.address, 1000000000000000);
    await artiStakeContract.connect(stakerA).withdraw(artistB.address, 1000000000000000);
    // userA withdraw of artistB
  });

  it("cannot register already listed artist", async function () {
    await expect(artiStakeContract.connect(signer).registerToArtistlist(artistA.address)).to.revertedWith(
      "already registered"
    );
  });
  it("not owner signer cannot update artistlist", async function () {
    await expect(artiStakeContract.connect(stakerA).registerToArtistlist(notArtist.address)).to.revertedWith(
      "Ownable: caller is not the owner"
    );
  });
  it("cannot remove not listed artist", async function () {
    await expect(artiStakeContract.connect(signer).removeFromArtistlist(notArtist.address)).to.revertedWith(
      "not listed"
    );
  });
  it("add not listed artist", async function () {
    await artiStakeContract.connect(signer).registerToArtistlist(notArtist.address);
    expect(await artiStakeContract.artistList(notArtist.address)).to.be.true;
  });
  it("not owner signer cannot update artistInterestRatio", async function () {
    await expect(artiStakeContract.connect(stakerA).updateArtistInterestRatio(300)).to.revertedWith(
      "Ownable: caller is not the owner"
    );
  });
  it("cannot set artistInterestRatio higher than 10000", async function () {
    await expect(artiStakeContract.connect(signer).updateArtistInterestRatio(10000)).to.revertedWith(
      "ratio must be smaller than base"
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
    await expect(artiStakeContract.connect(signer).updateArtiStakeFeeRatio(10000)).to.revertedWith(
      "ratio must be smaller than base"
    );
  });
  it("can set rtiStakeFeeRatio", async function () {
    const changedRatio = 300;
    await artiStakeContract.connect(signer).updateArtiStakeFeeRatio(changedRatio);
    expect(await artiStakeContract.artistInterestRatio()).to.equal(changedRatio);
  });

  it("staker can deposit and withdraw to multiple artists", async function () {
    // userA deposit to artistA
    await artiStakeContract.connect(stakerA).deposit(artistA.address, 0, { value: 1000000000000000 });
    const a = await artiStakeContract.connect(stakerA).getStakerBalanceWithInterest(artistA.address);
    console.log(a, "a");
    await ethers.provider.send("evm_increaseTime", [31536000]);
    const b = await artiStakeContract.connect(stakerA).getStakerBalanceWithInterest(artistA.address);
    console.log(b, "b");
  });
});
