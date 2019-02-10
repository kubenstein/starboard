import React from 'react';
import DependencyContext from '.';

const connect = (mapStateToProps = (() => {})) => Component => props => (
  <DependencyContext.Consumer>
    {deps => (
      <Component
        {...props}
        {...mapStateToProps(deps, props)}
      />
    )}
  </DependencyContext.Consumer>
);

export default connect;
