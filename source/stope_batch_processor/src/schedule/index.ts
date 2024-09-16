import { exportSTO } from "#apis/index.ts";

const INTERVAL = 1000;

export function scheduleBridge() {
  console.log("Start scheduling bridge");

  setInterval(async () => {
    await exportSTO();
  }, INTERVAL);
}
