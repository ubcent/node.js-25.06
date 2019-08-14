import React from 'react';

export default function TodoItem({ item, removeItem, markTodoDone }) {
  const onClickClose = () => removeItem(item.id);
  const onClickDone = () => markTodoDone(item.id);
  const todoClass = item.done ? 'done' : 'undone';

  return(
    <li className="list-group-item ">
      <div className={todoClass}>
        <span className="glyphicon glyphicon-ok icon" aria-hidden="true" onClick={onClickDone}></span>
        {item.value}
        <button type="button" className="close" onClick={onClickClose}>&times;</button>
      </div>
    </li>     
  );
}
