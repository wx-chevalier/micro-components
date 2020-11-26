import * as React from 'react';

export interface IImageHolderProps {}

export interface IImageHolderState {}

export default class ImageHolder extends React.Component<IImageHolderProps, IImageHolderState> {
  constructor(props: IImageHolderProps) {
    super(props);

    this.state = {};
  }

  public render() {
    return <div></div>;
  }
}
