import api from './api';

export default function getSessionId() {
  return fetch(`${api.url}/authentication/guest_session/new?${api.key}`).then((res) => {
    if (res.ok) return res.json();
    throw new Error(res.status);
  });
}
