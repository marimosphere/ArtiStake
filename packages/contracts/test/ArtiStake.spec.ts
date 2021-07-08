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
  let artist: SignerWithAddress;
  this.beforeEach(async function () {
    [signer, artist] = await ethers.getSigners();
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
    await artiStakeContract.deposit(artist.address, 0, { value: 100000000000000 });
    const balanceAfter = await ethers.provider.getBalance(artiStakeContract.address);
    expect(balanceAfter).to.equal(0);
    const balanceATokenAfter = await artiStakeContract.getAtokenScaledBalance(POLYGON_AAVE_WETH_ATOKEN_ADDRESS);
    expect(balanceATokenAfter).to.be.above(0);
  });

  it("User can withdraw 全額", async function () {
    await artiStakeContract.deposit(artist.address, 0, { value: 1000000000000000 });
    await ethers.provider.send("evm_increaseTime", [31536000]);
    const artistBalanceBefore = await ethers.provider.getBalance(artist.address);
    const signerBalanceBefore = await ethers.provider.getBalance(signer.address);
    await artiStakeContract.withdraw(artist.address, 1000000000000000);
    const balanceAToken = await artiStakeContract.getAtokenScaledBalance(POLYGON_AAVE_WETH_ATOKEN_ADDRESS);
    expect(balanceAToken).to.be.above(0);
    const artistBalanceAfter = await ethers.provider.getBalance(artist.address);
    const signerBalanceAfter = await ethers.provider.getBalance(signer.address);
    expect(artistBalanceAfter).to.be.above(artistBalanceBefore);
  });

  it.only("User can withdraw 一部", async function () {
    await artiStakeContract.deposit(artist.address, 0, { value: 1000000000000000 });
    await ethers.provider.send("evm_increaseTime", [31536000]);
    const artistBalanceBefore = await ethers.provider.getBalance(artist.address);
    const signerBalanceBefore = await ethers.provider.getBalance(signer.address);
    await artiStakeContract.withdraw(artist.address, 1000000000000);
    const balanceAToken = await artiStakeContract.getAtokenScaledBalance(POLYGON_AAVE_WETH_ATOKEN_ADDRESS);
    expect(balanceAToken).to.be.above(0);
    const artistBalanceAfter = await ethers.provider.getBalance(artist.address);
    const signerBalanceAfter = await ethers.provider.getBalance(signer.address);
    expect(artistBalanceAfter).to.be.above(artistBalanceBefore);
    console.log(artistBalanceAfter.sub(artistBalanceBefore));
  });

  it("Multiple User can withdraw", async function () {
    // userA deposit
    // userB deposit
    // userB withdraw
    // userA withdraw
  });

  it("Multiple User can withdraw", async function () {
    // userA deposit to artistA
    // userA deposit to artistB
    // userA withdraw of artistA
    // userA withdraw of artistB
  });

  it("Deposit twice", async function () {
    await artiStakeContract.deposit(artist.address, 0, { value: 100000000000000 });
    console.log("-----------------");
    await ethers.provider.send("evm_increaseTime", [3600000]);
    await artiStakeContract.deposit(artist.address, 0, { value: 100000000000000 });
    // expect(balanceAfter > balanceBefore).to.be.true
    // artiStakeCOntractのdepositedAmountの変化をみる
  });
});
