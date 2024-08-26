import { runServer } from "./server/run";

(async function main() {
  console.log("api server");

  const p1 = await runServer();

  Promise.all([p1]);
})();
