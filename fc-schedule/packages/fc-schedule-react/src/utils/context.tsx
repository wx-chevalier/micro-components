import * as React from 'react';

import { UiConfig } from '../controller/UiConfig';

const Context = React.createContext({ config: new UiConfig() });

export const { Consumer, Provider } = Context;

// This is a HOC function.
// It takes a component...
export default function withContext<T>(Component) {
  // ...and returns another component...
  return (props: T) => {
    // ... and renders the wrapped component with the context theme!
    // Notice that we pass through any additional props as well
    return <Consumer>{value => <Component {...props} config={value.config} />}</Consumer>;
  };
}
