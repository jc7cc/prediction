import Web3 from "web3";
import { predictionABI } from "./abi/prediction.js";
import { config } from "./config.js";
import * as utils from "./utils.js";

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

async function getUserRounds(address) {
  const resp = await getUserRoundsLength(address);
  if (resp.status === utils.status.fail) {
    console.error(`failed to get user round length`, resp.err);
  }
  console.log(resp);
  const rounds = new Map();
  const size = 100;
  for (let i = 0; i <= resp.length; i += size) {
    const resp = await prediction.methods.getUserRounds(address, i, size)
      .call();
    for (let j = 0; j < +resp["2"]; j++) {
      const roundId = resp["0"][j];
      const roundDta = resp["1"][j];
      console.log(roundId);
      rounds.set(roundId, roundDta);
    }
  }

  console.log(rounds.size);
}

const target = "0x5458391eFE085370AEC4d2Cf6ED0a76548125038";

getUserRounds(target);

// userRoundsLength("0x5458391eFE085370AEC4d2Cf6ED0a76548125038").then(
//   console.log,
// );
