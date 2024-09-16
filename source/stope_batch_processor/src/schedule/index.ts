import { exportSTO } from "#apis/index.ts";

const INTERVAL = 30000;

export async function scheduleBridge() {
  console.log("Start scheduling bridge");

  await exportSTO();

  // setInterval(async () => {
  //   await exportSTO();
  // }, INTERVAL);
}
