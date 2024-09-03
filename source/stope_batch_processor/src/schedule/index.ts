import { exportSTO } from "../apis";
import { TaskKind } from "../task_queue/task";
import { taskQueue } from "../task_queue/task_queue";

// const DAY_MS = 3600 * 1000 * 24;
const DAY_MS = 1000;

export function scheduleBridge() {
  console.log("Start scheduling bridge");

  setInterval(() => {
    const task = {
      kind: TaskKind.ExportSTO,
      args: {},
    };

    taskQueue.enqueue(task);

    console.log("Scheduled a daily task!");
  }, 2000);
}
