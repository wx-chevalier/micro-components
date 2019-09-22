import { Id, Task, TaskLink, TaskGroup } from './../types';

/** 注册中心 */
export class DataRegistry {
  taskGroupMap: Record<Id, { item: TaskGroup; rowNum: number }>;
  taskMap: Record<Id, { item: Task; rowNum: number }>;

  linkMap: Record<Id, { item: TaskLink; index: number }[]>;

  constructor() {
    this.taskMap = {};
    this.taskGroupMap = {};
    this.linkMap = {};
  }

  /** 注册任务组 */
  registerTaskGroups(taskGroups: TaskGroup[] = []) {
    for (let i = 0; i < taskGroups.length; i++) {
      const taskGroup = taskGroups[i];

      this.taskGroupMap[taskGroup.id] = { item: taskGroup, rowNum: i };
      (taskGroup.tasks || []).forEach(task => {
        this.taskMap[task.id] = { item: task, rowNum: i };
      });
    }
  }

  registerLinks(links: TaskLink[] = []) {
    let start: Id = 0;
    let end: Id = 0;

    for (let i = 0; i < links.length; i++) {
      const link = links[i];

      start = link.start;
      end = link.end;

      const value = { item: link, index: i };

      this.addLink(start, value);
      this.addLink(end, value);
    }
  }

  addLink(taskId: Id, value) {
    if (!this.linkMap[taskId]) {
      this.linkMap[taskId] = [];
    }

    if (this.linkMap[taskId].indexOf(value) === -1) {
      this.linkMap[taskId].push(value);
    }
  }

  getTask(taskId: Id): { item: Task; rowNum: number } {
    return this.taskMap[taskId];
  }

  getLinks(taskId: Id): { item: TaskLink; index: number }[] {
    return this.linkMap[taskId];
  }
}

export const dataRegistry = new DataRegistry();
