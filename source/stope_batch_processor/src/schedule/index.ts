import { exportSTO } from "#apis/index.ts";

const INTERVAL = 3000;

export function scheduleBridge() {
  console.log("Start scheduling bridge");

  setInterval(async () => {
    await exportSTO();
  }, INTERVAL);
}
