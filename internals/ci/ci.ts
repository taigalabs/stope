import { Command } from "commander";
import fs from 'fs'
import { spawn } from "child_process";
import path from 'path'

import { paths } from "./paths.ts";

function main() {
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
      cwd: paths.stope_web_app,
    });
  });

  program.command("build_contracts").action((str, options) => {
    spawn("yarn run build", {
      stdio: "inherit",
      shell: true,
      cwd: paths.stope_user_proof,
    });
  });

  program
    .command("docker")
    .arguments("<file>") //
    .action(() => {
      const filename = `run.sh`;
      const fpath = path.resolve(paths.docker, filename);

      if (fs.existsSync(fpath)) {
        console.info("Found docker script, running, path: %s", fpath);

        spawn(`sh ${fpath}`, {
          stdio: "inherit",
          shell: true,
          cwd: paths.docker,
        });
      } else {
        console.error("Docker script does not exist, path: %s", fpath);
      }
    });

  program.parse();
}

main();
