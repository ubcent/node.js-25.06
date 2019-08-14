import React, { useState } from 'react';

import Header from './Header';
import { setToken, fetchToApi } from '../helpers';

export default function Auth() {
  const [mode, setMode] = useState('auth');
  const [fields, setFields] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const toggleMode = () => {
    setMode(mode === 'auth' ? 'register' : 'auth');
  };

  const handleFieldChange = event => {
    setFields({
      ...fields,
      [event.target.name]: event.target.value,
    })
  };

  const handleSubmit = async event => {
    event.preventDefault();

    const data = mode === 'auth' 
      ? { username: fields.email, password: fields.password }
      : { ...fields };
    const url = `/${mode}`
    const responce = await fetchToApi('POST', data, null, url);
    const { result, token } = await responce.json();

    if (result !== 'success') return alert('Some Error');

    setToken(token);
    window.location.reload();
  };

  return (
    <div id="main">
      <Header title={mode === 'auth' ? 'Вход' : 'Регистрация'}>
        <button onClick={toggleMode} className="btn btn-default">
          {mode === 'auth' ? 'Регистрация' : 'Вход'}
        </button>
      </Header>
      <form
        onSubmit={ handleSubmit}
      >
        <input
          type="text"
          name="email"
          className="form-control"
          placeholder="email"
          value={fields.email}
          onChange={handleFieldChange}
        />
        {mode === 'register' && (
          <>
            <input
              type="text"
              name="firstName"
              className="form-control"
              placeholder="firstName"
              value={fields.firstName}
              onChange={handleFieldChange}
            />
            <input
              type="text"
              name="lastName"
              className="form-control"
              placeholder="lastName"
              value={fields.lastName}
              onChange={handleFieldChange}
            />
          </>
        )}
        <input
          type="password"
          name="password"
          className="form-control"
          placeholder="password"
          value={fields.password}
          onChange={handleFieldChange}
        />
        <button type="submit" className="btn btn-default">
          {mode === 'auth' ? 'Вход' : 'Регистрация'}
        </button> 
      </form>
    </div>
  )
}
