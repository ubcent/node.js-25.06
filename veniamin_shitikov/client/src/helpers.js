const PORT = 8000;

export const getToken = () => {
  return localStorage.getItem('jwt-token');
};

export const setToken = token => {
  localStorage.setItem('jwt-token', token);
};

export const fetchToApi = (method, data, id = '', url = '/tasks') => {
  const token = `Bearer ${getToken()}`;
  const fetchUrl = id ? `${url}/${id}:${PORT}` : `${url}:${PORT}`;

  return fetch(fetchUrl, {
    method, 
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    body: JSON.stringify(data), 
  });
};
