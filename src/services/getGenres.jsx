import api from './api';

export default function getGenres() {
  return fetch(`${api.url}/genre/movie/list?${api.key}`).then((res) => {
    if (res.ok) return res.json();
    throw new Error(res.status);
  });
}
