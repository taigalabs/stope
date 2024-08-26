export interface Task {
  kind: TaskKind;
  args: TaskArgs;
}

export enum TaskKind {
  ExportSTO,
}

export type TaskArgs = ExportSTOArgs;

export interface ExportSTOArgs {}
