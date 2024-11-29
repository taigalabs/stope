import { runServer } from "../server/run.ts";

(async function main() {
  console.log("Starting api server...");

  const p1 = await runServer();

  Promise.all([p1]);
})();
