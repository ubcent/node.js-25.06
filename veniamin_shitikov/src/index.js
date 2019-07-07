import React from 'react';
import { render, AppContext } from 'ink';
import App from './components/App';

render(<AppContext.Consumer>{() => <App />}</AppContext.Consumer>);
