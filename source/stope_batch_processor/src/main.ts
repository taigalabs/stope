import { hang } from "./hang";
import { scheduleBridge } from "./schedule";
// import { runTaskQueue } from "./task_queue";

(async function main() {
  console.log("stope batch processor");

  const p1 = scheduleBridge();
  // const p2 = runTaskQueue();

  Promise.all([p1]);
})();
