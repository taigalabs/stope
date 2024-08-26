import { parseArgs } from "node:util";
import { program } from "commander";
import { Command } from "commander";
import { spawn } from "child_process";

import { paths } from "./paths";

(async function main() {
  console.log("Starting ci, pwd: %s", process.cwd());

  const program = new Command();
  program.name("STO CI");

  program
    .command("dev_stope_api_server")
    .option("--first", "display just the first substring")
    .action((str, options) => {
      console.log("path: %s", paths.stope_api_server);

      spawn("yarn run dev", {
        stdio: "inherit",
        shell: true,
        cwd: paths.stope_api_server,
      });
    });

  program.parse();
})();
