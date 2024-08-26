import { Task } from "./task";

const QUEUE_CAPACITY = 50;

class TaskQueue {
  q: Task[] = [];

  len() {
    return this.q.length;
  }

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

  shift() {
    return this.q.shift();
  }
}

export const taskQueue = new TaskQueue();
