import { exportBlock } from "../apis";

const DAY_MS = 3600 * 1000 * 24;

export function scheduleBridge() {
  setInterval(() => {
    exportBlock();
  }, DAY_MS);
}
