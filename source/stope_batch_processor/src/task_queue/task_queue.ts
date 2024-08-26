class TaskQueue {
  q: Task[] = [];

  add(task: Task) {
    this.q.push(task);
  }

  shift() {
    return this.q.shift();
  }
}

export const taskQueue = new TaskQueue();

export interface Task {
  kind: TaskKind;
}

export enum TaskKind {
  ExportSTO,
}
