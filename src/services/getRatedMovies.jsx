import api from './api';

export default function getRatedMovies(guestSessionId, currentPage) {
  return fetch(`${api.url}/guest_session/${guestSessionId}/rated/movies?${api.key}&page=${currentPage}`).then((res) => {
    if (res.ok) return res.json();
    throw new Error(res.status);
  });
}
