import React from 'react';

import Header from './components/Header';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import { fetchToApi } from './helpers';

export default class TodoApp extends React.Component {
  state = { todoItems: [] };

  componentDidMount = async () => {
    const responce = await fetchToApi('GET');
    const { todos } = await responce.json()
    this.setState({ todos });
  };
  
  addItem = async (text, done = false) => {
    const responce = await fetchToApi('POST', { text, done });
    const todo = await responce.json();
    this.setState({todoItems: [todo, ...this.state.todoItems]});
  }

  removeItem = async itemId => {
    const responce = await fetchToApi('DELETE', null, itemId);
    const { status } = await responce.json();

    if (status !== 'OK') return alert('Error');
  
    this.setState({ todoItems: this.state.todoItems.filter(todo => todo.id !== itemId) });
  }

  markTodoDone = async itemId => {
    const todo = this.state.todoItems.find(todo => todo.id === itemId);
    const done = !todo.done;
    const responce = await fetchToApi('PATCH', { done }, itemId);
    const { status } = await responce.json();

    if (status !== 'OK') return alert('Error');

    this.setState({
      todoItems: this.state.todoItems.map(item => {
        if (item.id === itemId) return ({ ...item, done });

        return item;
      })
    });  
  }

  render() {
    return (
      <div id="main">
        <Header />
        <TodoList
          items={this.props.initItems}
          removeItem={this.removeItem}
          markTodoDone={this.markTodoDone}
        />
        <TodoForm addItem={this.addItem} />
      </div>
    );
  }
}
