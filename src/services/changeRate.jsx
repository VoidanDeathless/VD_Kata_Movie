import api from './api';

export default function changeRate(movieId, guestSessionId, value) {
  return fetch(`${api.url}/movie/${movieId}/rating?${api.key}&guest_session_id=${guestSessionId}`, {
    method: value > 0 ? 'post' : 'delete',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify({ value }),
  });
}
