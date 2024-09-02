<<<<<<< HEAD
import { hang } from "./hang";
import { scheduleBridge } from "./schedule";
import { runTaskQueue } from "./task_queue";
=======
import { scheduleBridge } from "./schedule/index.ts";
>>>>>>> e8ec933 (o)

(async function main() {
  console.log("stope batch processor");

  const p1 = scheduleBridge();
  // const p2 = runTaskQueue();

  Promise.all([p1]);
})();
