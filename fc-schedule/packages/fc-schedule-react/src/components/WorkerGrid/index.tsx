import * as React from 'react';

export interface IWorkerGridProps {}

export interface IWorkerGridState {}

export class WorkerGrid extends React.Component<IWorkerGridProps, IWorkerGridState> {
  constructor(props: IWorkerGridProps) {
    super(props);

    this.state = {};
  }

  public render() {
    return <div></div>;
  }
}
