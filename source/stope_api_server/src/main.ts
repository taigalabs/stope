import { runServer } from "./server/run";

(async function main() {
  console.log("main");

  const p1 = await runServer();

  Promise.all([p1]);
})();
