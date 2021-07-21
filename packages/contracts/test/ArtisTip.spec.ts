import hre, { ethers } from "hardhat";
import * as chai from "chai";
import { solidity } from "ethereum-waffle";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

chai.use(solidity);
const { expect } = chai;

describe.only("ArtisTip", function () {
  let tipContract: any;
  let jpycContract: any;
  let signer: SignerWithAddress;
  let user: SignerWithAddress;
  let artist: SignerWithAddress;
  this.beforeEach(async function () {
    [signer, user, artist] = await ethers.getSigners();
    const Tip = await ethers.getContractFactory("ArtisTip");
    tipContract = await Tip.deploy();
    const JPYC = await ethers.getContractFactory("JPYC");
    jpycContract = await JPYC.deploy();
  });

  it("User can tip erc20", async function () {
    const tokenAmount = 10000;
    await jpycContract.connect(signer).mint(user.address, tokenAmount);
    const balance = await jpycContract.balanceOf(user.address);
    expect(balance).to.equal(tokenAmount);
    await jpycContract.connect(user).approve(tipContract.address, tokenAmount);
    const allowance = await jpycContract.allowance(user.address, tipContract.address);
    expect(allowance).to.equal(tokenAmount);
    const artistBalanceBefore = await jpycContract.balanceOf(artist.address);
    await tipContract.connect(user).tip(jpycContract.address, artist.address, tokenAmount);
    const artistBalanceAfter = await jpycContract.balanceOf(artist.address);
    expect(artistBalanceAfter.sub(artistBalanceBefore)).to.equal(tokenAmount);
  });
  it("User can tip matic", async function () {
    const tipAmount = 10000;
    const ethAddress = "0x0000000000000000000000000000000000000000";
    const userBalanceBefore = await ethers.provider.getBalance(user.address);
    const artistBalanceBefore = await ethers.provider.getBalance(artist.address);
    await tipContract.connect(user).tip(ethAddress, artist.address, tipAmount, { value: tipAmount });
    const userBalanceAfter = await ethers.provider.getBalance(user.address);
    const artistBalanceAfter = await ethers.provider.getBalance(artist.address);
    expect(userBalanceBefore).to.be.above(userBalanceAfter);
    expect(artistBalanceAfter).to.be.above(artistBalanceBefore);
  });
});
