/** 原子任务的定义 */
export type Id = string | number;

interface Base {
  id: Id;
  name?: string;
  desc?: string;

  extra?: any;
}

export interface BaseProps {
  itemHeight: number;
}

export interface TaskGroup extends Base {
  tasks: Task[];
}

export interface Task extends Base {
  // 开始与结束的时间，时间戳
  start: number | Date;
  end: number | Date;

  // 色块
  color?: string;
}

export interface EditingTask {
  task: Task;
  position: { start: number; end: number };
}

export type LinkPos = 'LINK_POS_LEFT' | 'LINK_POS_RIGHT';

export interface EditingLink {
  task: Task;
  position: LinkPos;
}

export interface TaskLink extends Base {
  start: Id;
  startPosition?: number;
  end: Id;
  endPosition?: number;
}

export interface UiConfig {
  header?: any;
  [key: string]: any;
}
