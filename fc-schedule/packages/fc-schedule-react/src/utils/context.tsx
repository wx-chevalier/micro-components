import * as React from 'react';

import { defaultConfig } from '../const/defaultConfig';

const Context = React.createContext({ config: defaultConfig });

export const { Consumer, Provider } = Context;

// This is a HOC function.
// It takes a component...
export default function withContext(Component) {
  // ...and returns another component...
  return props => {
    // ... and renders the wrapped component with the context theme!
    // Notice that we pass through any additional props as well
    return <Consumer>{value => <Component {...props} config={value.config} />}</Consumer>;
  };
}
