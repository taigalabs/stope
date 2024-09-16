import { exportSTO } from "@/apis";
// import { TaskKind } from "../task_queue/task";
// import { taskQueue } from "../task_queue/task_queue";

// const DAY_MS = 3600 * 1000 * 24;
const INTERVAL = 1000;

export function scheduleBridge() {
  console.log("Start scheduling bridge");

  setInterval(async () => {
    await exportSTO();
  }, INTERVAL);
}
