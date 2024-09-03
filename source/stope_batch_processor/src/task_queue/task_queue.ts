import { Task } from "./task";

const QUEUE_CAPACITY = 50;

class TaskQueue {
  q: Task[] = [];

  len() {
    return this.q.length;
  }

  wake() {}

  enqueue(task: Task) {
    if (this.q.length > QUEUE_CAPACITY) {
      console.log(
        "Queue is full, taskKind: %s, len: %s",
        task.kind,
        this.q.length
      );
      return;
    }

    this.q.push(task);
  }

  async shift() {
    return new Promise<Task | undefined>((resolve) => {
      setTimeout(() => {
        let task = this.q.shift();
        resolve(task);
      }, 1000);
    });
  }
}

export const taskQueue = new TaskQueue();
