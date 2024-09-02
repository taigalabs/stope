import { hang } from "./hang";
import { scheduleBridge } from "./schedule";
import { runTaskQueue } from "./task_queue";

(async function main() {
  console.log("stope batch processor");

  console.log(123123);
  setInterval(() => {
    console.log(2222);

    // console.log("Scheduled a daily task!");
  }, 500);

  const p1 = scheduleBridge();
  const p2 = runTaskQueue();
  // const p3 = hang();

  // Promise.all([p1, p2]);
})();

console.log(3344);

// const intervalID = setInterval(myCallback, 500, "Parameter 1", "Parameter 2");

// function myCallback(a: any, b: any) {
//   // Your code here
//   // Parameters are purely optional.
//   console.log(a);
//   console.log(b);
// }
