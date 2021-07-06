import * as fs from "fs";
import * as path from "path";
import hre from "hardhat";
import { NetworkName } from "./types";

export const filePath = "../network.json";
export const networkName = hre.network.name == "hardhat" ? "localhost" : <NetworkName>hre.network.name;

export const readFileAsJson = () => {
  const configsBuffer = fs.readFileSync(path.join(__dirname, filePath));
  return JSON.parse(configsBuffer.toString());
};

export const updateJson = (contractName: string, address: string) => {
  const contractNameLowerString = contractName.toLowerCase();
  networkName != "localhost" && console.log("json update for", contractNameLowerString);
  const configs = readFileAsJson();
  configs[networkName][contractNameLowerString] = address;
  fs.writeFileSync(path.join(__dirname, filePath), JSON.stringify(configs));
  networkName != "localhost" && console.log("json updated");
};


