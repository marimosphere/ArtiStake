import hre, { ethers } from "hardhat";
import * as chai from "chai";
import { solidity } from "ethereum-waffle";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  POLYGON_WETH_ADDRESS,
  POLYGON_AAVE_LENDING_POOL_ADDRESS,
  POLYGON_AAVE_WETH_GATEWAY_ADDRESS,
} from "../lib/constants";

chai.use(solidity);
const { expect } = chai;

describe("Tip", function () {
  let tipContract: any;
  let mockErc20Contract: any;
  let signer: SignerWithAddress;
  let user: SignerWithAddress;
  let artist: SignerWithAddress;
  const MAX_UINT = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff;
  this.beforeEach(async function () {
    [signer, user, artist] = await ethers.getSigners();
    const Tip = await ethers.getContractFactory("Tip");
    tipContract = await Tip.deploy();
    const ERC20 = await ethers.getContractFactory("MintableERC20");
    mockErc20Contract = await ERC20.deploy("TestToken", "TT", 18);
  });

  it("not owner user cannot add to whiteList", async function () {
    await expect(tipContract.connect(user).addToWhitelist(POLYGON_WETH_ADDRESS)).to.revertedWith(
      "Ownable: caller is not the owner"
    );
  });

  it("owner can add to whiteList", async function () {
    await tipContract.connect(signer).addToWhitelist(POLYGON_WETH_ADDRESS);
    expect(await tipContract.whitelisted(POLYGON_WETH_ADDRESS)).to.be.true;
  });

  it("not owner user cannot add to whiteList", async function () {
    await tipContract.connect(signer).addToWhitelist(POLYGON_WETH_ADDRESS);
    await expect(tipContract.connect(signer).addToWhitelist(POLYGON_WETH_ADDRESS)).to.revertedWith(
      "Tip: already added to whitelist"
    );
  });

  it("not owner user cannot remove from whiteList", async function () {
    await expect(tipContract.connect(user).removeFromWhitelist(POLYGON_WETH_ADDRESS)).to.revertedWith(
      "Ownable: caller is not the owner"
    );
  });

  it("owner can remove from whiteList", async function () {
    await tipContract.connect(signer).addToWhitelist(POLYGON_WETH_ADDRESS);
    expect(await tipContract.whitelisted(POLYGON_WETH_ADDRESS)).to.be.true;
    await tipContract.connect(signer).removeFromWhitelist(POLYGON_WETH_ADDRESS);
    expect(await tipContract.whitelisted(POLYGON_WETH_ADDRESS)).to.be.false;
  });

  it("cannot remove token not listed", async function () {
    await expect(tipContract.connect(signer).removeFromWhitelist(POLYGON_WETH_ADDRESS)).to.revertedWith(
      "Tip: cannot remove token not listed"
    );
  });

  it("User can tip", async function () {
    const tokenAmount = 10000;
    await mockErc20Contract.connect(user).mint(tokenAmount);
    const balance = await mockErc20Contract.balanceOf(user.address);
    expect(balance).to.equal(tokenAmount);
    await mockErc20Contract.connect(user).approve(tipContract.address, tokenAmount);
    const allowance = await mockErc20Contract.allowance(user.address, tipContract.address);
    expect(allowance).to.equal(tokenAmount);
    await tipContract.connect(signer).addToWhitelist(mockErc20Contract.address);
    const artistBalanceBefore = await mockErc20Contract.balanceOf(artist.address);
    await tipContract.connect(user).tip(mockErc20Contract.address, artist.address, tokenAmount);
    const artistBalanceAfter = await mockErc20Contract.balanceOf(artist.address);
    expect(artistBalanceAfter.sub(artistBalanceBefore)).to.equal(tokenAmount);
  });

  it("User cannot tip unlisted token", async function () {
    const tokenAmount = 10000;
    await mockErc20Contract.connect(user).mint(tokenAmount);
    const balance = await mockErc20Contract.balanceOf(user.address);
    expect(balance).to.equal(tokenAmount);
    await mockErc20Contract.connect(user).approve(tipContract.address, tokenAmount);
    const allowance = await mockErc20Contract.allowance(user.address, tipContract.address);
    expect(allowance).to.equal(tokenAmount);
    await expect(tipContract.connect(user).tip(mockErc20Contract.address, artist.address, tokenAmount)).to.revertedWith(
      "Tip: cannot tip token not listed"
    );
  });
});
