import { parseArgs } from "node:util";
import process from "process";

(async function main() {
  console.log("Starting ci, pwd: %s", process.cwd());
})();
