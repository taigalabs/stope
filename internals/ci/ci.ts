import { parseArgs } from "node:util";
import { program } from "commander";
import { Command } from "commander";
import { spawn } from "child_process";

import { paths } from "./paths";

(async function main() {
  console.log("Starting ci, pwd: %s", process.cwd());

  const program = new Command();
  program.name("STO CI");

  program.command("dev_stope_api_server").action((str, options) => {
    spawn("yarn run dev", {
      stdio: "inherit",
      shell: true,
      cwd: paths.stope_api_server,
    });
  });

  program.command("dev_stope_batch_processor").action((str, options) => {
    spawn("yarn run dev", {
      stdio: "inherit",
      shell: true,
      cwd: paths.stope_batch_processor,
    });
  });

  program.command("dev_stope_web_app").action((str, options) => {
    spawn("yarn run dev", {
      stdio: "inherit",
      shell: true,
      cwd: paths.stope_batch_processor,
    });
  });

  program.parse();
})();
