import Web3 from "web3";
import { predictionABI } from "./abi/prediction.js";
import { config } from "./config.js";
import * as utils from "./utils.js";
import * as db from "./utils.js";

let endpoint;
if (process.argv[2] === "test") {
  endpoint = config.publicRPC;
} else {
  endpoint = config.privateRPC;
}

export const web3 = new Web3(endpoint);

const prediction = new web3.eth.Contract(
  predictionABI,
  config.bnbPredictionAddr,
);

async function getUserRoundsLength(address) {
  try {
    const length = await prediction.methods.getUserRoundsLength(address).call();
    return {
      status: utils.status.success,
      length: length,
    };
  } catch (err) {
    return {
      status: utils.status.fail,
      err: err,
    };
  }
}

export async function getUserRounds(address) {
  const resp = await getUserRoundsLength(address);
  if (resp.status === utils.status.fail) {
    console.error(`failed to get user round length`, resp.err);
  }

  const rounds = new Map();
  const size = 100;
  for (let i = 0; i <= resp.length; i += size) {
    const resp = await prediction.methods.getUserRounds(address, i, size)
      .call();
    for (let j = 0; j < +resp["1"].length; j++) {
      const roundId = resp["0"][j];
      const roundData = await prediction.methods.rounds(roundId).call();
      const userRoundData = resp["1"][j];

      rounds.set(roundId, {
        userData: userRoundData,
        roundData: utils.ignoreNumKey(roundData),
      });
    }
  }

  return rounds;
}

// userRoundsLength("0x5458391eFE085370AEC4d2Cf6ED0a76548125038").then(
//   console.log,
// );
