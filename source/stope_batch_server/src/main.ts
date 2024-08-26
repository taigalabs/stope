import { scheduleBridge } from "./schedule";

(async function main() {
  console.log("main");

  const p1 = scheduleBridge();

  Promise.all([p1]);
})();
