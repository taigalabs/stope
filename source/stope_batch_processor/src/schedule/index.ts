import { exportSTO } from "../apis";

// const DAY_MS = 3600 * 1000 * 24;
const DAY_MS = 1000;

export function scheduleBridge() {
  setInterval(() => {
    console.log("scheduled a daily task!");

    exportSTO();
  }, DAY_MS);
}
