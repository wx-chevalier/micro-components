import * as React from 'react';

const Context = React.createContext({ lightbox: {} });

export const { Consumer, Provider } = Context;

// This is a HOC function.
// It takes a component...
export function withContext(Component) {
  // ...and returns another component...
  return props => {
    // ... and renders the wrapped component with the context theme!
    // Notice that we pass through any additional props as well
    return <Consumer>{value => <Component {...props} {...value} />}</Consumer>;
  };
}
