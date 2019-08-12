import React from 'react';

import './App.css';
import { getToken } from './helpers';
import TodoApp from './TodoApp';
import Auth from './components/Auth';

export default function App() {
  const token = getToken();

  return (
    <div className="App">
      {token 
        ? <TodoApp />
        : <Auth /> 
      }
    </div>
  );
}
