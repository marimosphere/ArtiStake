const networkId = process.env.NODE_ENV == "development" ? 81 : 81; // TODO:

const rpc = process.env.NODE_ENV == "development"
  ? "https://rpc.shibuya.astar.network:8545"
  : "https://rpc.shibuya.astar.network:8545" // TODO:

module.exports = { networkId, rpc };
