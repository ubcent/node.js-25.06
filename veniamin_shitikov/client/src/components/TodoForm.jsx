import React, { useState } from 'react';

export default function TodoForm({ addItem }) {
  const [todo, setTodo] = useState('');
  const onSubmit = event => {
    event.preventDefault();
    
    addItem(todo);
    setTodo('');
  };

  const onChange = event => {
    setTodo(event.target.value);
  };

  return (
    <form onSubmit={onSubmit} className="form-inline">
      <input
        type="text"
        className="form-control"
        placeholder="add a new todo..."
        value={todo}
        onChange={onChange}
      />
      <button type="submit" className="btn btn-default">Add</button> 
    </form>
  );   
}
