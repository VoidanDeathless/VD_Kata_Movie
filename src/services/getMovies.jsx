import api from './api';

export default function getMovies(query, currentPage) {
  return fetch(`${api.url}/search/movie?${api.key}&query=${query}&page=${currentPage}`).then((res) => {
    if (res.ok) return res.json();
    throw new Error(res.status);
  });
}
