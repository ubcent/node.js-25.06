const React = require('react');
const { render, AppContext } = require('ink');
const { App } = require('./components/App')


render(
  <AppContext.Consumer>
    {() => <App />}
  </AppContext.Consumer>
);
