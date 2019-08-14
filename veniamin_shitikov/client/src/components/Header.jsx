import React from 'react';

export default function Header({ title, children }) {
  return (
    <div className="header">
      <h1>{title}</h1>
      {children}
    </div>
  )
}
