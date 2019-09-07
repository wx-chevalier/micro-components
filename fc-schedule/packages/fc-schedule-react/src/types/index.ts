/** 原子任务的定义 */
interface Base {
  id: string;
  name: string;
  desc?: string;

  extra?: any;
}

export interface Worker extends Base {
  tasks?: Task[];
}

export interface Task extends Base {
  // 关联的处理人的信息
  worker?: Worker;

  // 开始与结束的时间，时间戳
  start: number | Date;
  end: number | Date;

  // 色块
  color?: string;
}

export interface LinkType extends Base {
  start: {
    x: number;
    y: number;
  };
  end: {
    x: number;
    y: number;
  };
}

export interface UiConfig {
  header?: any;
  [key: string]: any;
}

export interface BaseProps {
  itemHeight: number;
}
