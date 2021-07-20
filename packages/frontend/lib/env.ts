export const rpc = process.env.NODE_ENV == "development" ? "http://localhost:8545" : "https://rpc-mumbai.matic.today";
export const networkId = process.env.NODE_ENV == "development" ? 4 : 137;
export const subgraphUrl =
  process.env.NODE_ENV == "development"
    ? "https://api.thegraph.com/subgraphs/name/aave/aave-v2-polygon-mumbai"
    : "https://api.thegraph.com/subgraphs/name/aave/aave-v2-matic";
