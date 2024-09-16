import { scheduleBridge } from "./schedule/index.ts";

(async function main() {
  console.log("stope batch processor");

  const p1 = scheduleBridge();
  // const p2 = runTaskQueue();

  Promise.all([p1]);
})();
