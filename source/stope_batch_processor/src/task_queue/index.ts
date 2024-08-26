import { TaskKind, taskQueue } from "./task_queue";

export async function runTaskQueue() {
  while (true) {
    const task = taskQueue.shift();

    if (task) {
      switch (task.kind) {
        case TaskKind.ExportSTO:
          break;
      }
    }
  }
}
