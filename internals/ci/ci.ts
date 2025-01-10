import { Command } from "commander";
import { spawn } from "child_process";

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

  program.command("create_data").action((str, options) => {
    spawn("yarn test -t 'create_data'", {
      stdio: "inherit",
      shell: true,
      cwd: paths.stope_bridge_proof,
    });
  });

  program.command("create_data2").action((str, options) => {
    spawn("yarn test -t 'create_data2'", {
      stdio: "inherit",
      shell: true,
      cwd: paths.stope_bridge_proof,
    });
  });

  program.command("batch_bridge").action((str, options) => {
    spawn("yarn run batch", {
      stdio: "inherit",
      shell: true,
      cwd: paths.stope_bridge_proof,
    });
  });

  program.command("test_bridge").action((str, options) => {
    spawn("yarn test -t 'bridge_1'", {
      stdio: "inherit",
      shell: true,
      cwd: paths.stope_bridge_proof,
    });
  });

  program.command("test_user_proof").action((str, options) => {
    spawn("yarn test -t 'user_proof_1'", {
      stdio: "inherit",
      shell: true,
      cwd: paths.stope_user_proof,
    });
  });

  program.command("dev_stope_web_app").action((str, options) => {
    spawn("yarn run dev", {
      stdio: "inherit",
      shell: true,
      cwd: paths.ui,
    });
  });

  program.command("build_zkapps").action((str, options) => {
    spawn("yarn run build", {
      stdio: "inherit",
      shell: true,
      cwd: paths.stope_user_proof,
    });

    spawn("yarn run build", {
      stdio: "inherit",
      shell: true,
      cwd: paths.stope_bridge_proof,
    });
  });

  program.parse();
}

main();
