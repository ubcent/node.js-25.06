import React from 'react';

import TodoItem from './TodoItem';

export default function TodoList({ todos = [] }) {
  return (
    <ul className="list-group">
      {todos.map((item, index) => (
        <TodoItem
          key={index}
          item={item}
          index={index}
          removeItem={this.props.removeItem}
          markTodoDone={this.props.markTodoDone}
        />
      ))}
    </ul>
  );
}
