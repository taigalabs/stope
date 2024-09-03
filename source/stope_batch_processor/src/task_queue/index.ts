import { exportSTO } from "../apis";
import { TaskKind } from "./task";
import { taskQueue } from "./task_queue";

export async function runTaskQueue() {
  console.log("Running task queue");

  while (true) {
    console.log("There is no more task!, quitting");

    const task = await taskQueue.shift();

    if (task) {
      switch (task.kind) {
        case TaskKind.ExportSTO:
          await exportSTO(task.args);
          break;

        default:
          throw new Error("Task invalid");
      }
    }
  }
}
