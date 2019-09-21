import * as React from 'react';

export interface IWorkerGridProps {}

export interface IWorkerGridState {}

/** 工作机器的网格视图 */
export class WorkerGrid extends React.Component<IWorkerGridProps, IWorkerGridState> {
  constructor(props: IWorkerGridProps) {
    super(props);

    this.state = {};
  }

  public render() {
    return <div></div>;
  }
}
