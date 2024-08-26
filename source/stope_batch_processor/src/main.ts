import { scheduleBridge } from "./schedule";

(async function main() {
  console.log("stope batch processor");

  const p1 = scheduleBridge();

  Promise.all([p1]);
})();
