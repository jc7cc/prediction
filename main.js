import * as web3 from "./web3.js";
import * as db from "./db.js";

const target = "0x5458391eFE085370AEC4d2Cf6ED0a76548125038";

async function main() {
  web3.getRounds(0, 137287);
}

main();
