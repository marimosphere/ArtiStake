import hre, { ethers } from "hardhat";
import * as chai from "chai";
import { solidity } from "ethereum-waffle";
import {
  POLYGON_AAVE_LENDING_POOL_ADDRESS,
  POLYGON_AAVE_WETH_GATEWAY_ADDRESS,
} from "../lib/constants";

chai.use(solidity);
const { expect } = chai;

describe("ArtiStake", function () {
  let artiStakeContract: any
  let signer;
  this.beforeEach(async function () {
    [signer] = await ethers.getSigners();
    const ArtiStake = await ethers.getContractFactory("ArtiStake");
    artiStakeContract = await ArtiStake.deploy(POLYGON_AAVE_LENDING_POOL_ADDRESS, POLYGON_AAVE_WETH_GATEWAY_ADDRESS);
  });

  it("User can stake to Artist", async function () {  
    // artiStakeContract.deposit()をする
    await artiStakeContract.deposit(10000, 0)
    // artiStakeCOntractのdepositedAmountの変化をみる
  });

  it("User can get yield", async function () {
    // aaveにステークする
    // timestamp進める
    // witdrawする
    // matic増えてる
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
