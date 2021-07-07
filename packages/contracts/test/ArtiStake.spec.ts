import hre, { ethers } from "hardhat";
import * as chai from "chai";
import { solidity } from "ethereum-waffle";
import {
  POLYGON_WETH_ADDRESS,
  POLYGON_AAVE_LENDING_POOL_ADDRESS,
  POLYGON_AAVE_WETH_GATEWAY_ADDRESS,
} from "../lib/constants";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

chai.use(solidity);
const { expect } = chai;

describe("ArtiStake", function () {
  let artiStakeContract: any
  let signer: SignerWithAddress;
  let artist: SignerWithAddress
  this.beforeEach(async function () {
    [signer, artist] = await ethers.getSigners();
    const ArtiStake = await ethers.getContractFactory("ArtiStake");
    artiStakeContract = await ArtiStake.deploy(POLYGON_AAVE_LENDING_POOL_ADDRESS, POLYGON_AAVE_WETH_GATEWAY_ADDRESS, POLYGON_WETH_ADDRESS);
  });

  it.only("User can stake to Artist", async function () {  
    // artiStakeContract.deposit()をする
    const balanceBefore = await ethers.provider.getBalance(artiStakeContract.address);
    expect(balanceBefore).to.equal(0)
    
    await artiStakeContract.deposit(artist.address, 0, {value: 100000000000000})
    await ethers.provider.send("evm_increaseTime", [31536000])
    await artiStakeContract.withdraw(artist.address, 100500000000)
    const artistBalance = await ethers.provider.getBalance(artist.address);
    console.log(artistBalance.toString( ), "aa")
    // expect(balanceAfter > balanceBefore).to.be.true
    // artiStakeCOntractのdepositedAmountの変化をみる
  });

  it("User can get yield", async function () {
    // aaveにステークする
    // timestamp進める
    // witdrawする
    // matic増えてる
  });

  it("Deposit twice", async function () {      
    await artiStakeContract.deposit(artist.address, 0, {value: 100000000000000})
    console.log("-----------------")
    await ethers.provider.send("evm_increaseTime", [3600000])
    await artiStakeContract.deposit(artist.address, 0, {value: 100000000000000})
    // expect(balanceAfter > balanceBefore).to.be.true
    // artiStakeCOntractのdepositedAmountの変化をみる
  });


  // it("Artist can get yield", async function () {
  //   // aaveにステークする
  //   // timestamp進める
  //   // witdrawする
  //   // matic増えてる
  //   // 分配が正しく行われている
  // });

  // it("Add currency", async function () {
  //   // depositできるコインを増やす
  // })

});
