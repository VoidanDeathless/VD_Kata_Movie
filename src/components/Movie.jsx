import { Image, Typography, Tag, Rate } from 'antd';
import { format } from 'date-fns';

import GenresContext from './GenresContext';
import api from './Api';

const { Title, Paragraph, Text } = Typography;

const rateColor = (rate) => {
  if (rate > 7) return '#66E900';
  if (rate > 5) return '#E9D100';
  if (rate > 3) return '#E97E00';
  return '#E90000';
};

export default function Movie({ movie, guestSessionId, onRate, rating }) {
  const rate = (movieId, value) => {
    fetch(`${api.url}/movie/${movieId}/rating?${api.key}&guest_session_id=${guestSessionId}`, {
      method: value > 0 ? 'post' : 'delete',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json; charset=UTF-8' },
      body: JSON.stringify({ value }),
    }).then(() => onRate(movieId, value));
  };

  return (
    <div className="movie">
      <Image className="movie__image" src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} />

      <header className="movie__header">
        <Title ellipsis={{ rows: 1 }} level={4}>
          {movie.title}
        </Title>

        <Paragraph>
          {movie.release_date && <Text type="secondary">{format(new Date(movie.release_date), 'PPP')}</Text>}
        </Paragraph>

        <GenresContext.Consumer>
          {(genres) => (
            <Paragraph className="movie__tags">
              {genres.map((genre) => movie.genre_ids.includes(genre.id) && <Tag key={genre.id}>{genre.name}</Tag>)}
            </Paragraph>
          )}
        </GenresContext.Consumer>
      </header>

      <div className="movie__score" style={{ borderColor: rateColor(Math.round(movie.vote_average * 10) / 10) }}>
        {Math.round(movie.vote_average * 10) / 10}
      </div>

      <div className="movie__description">
        <Paragraph className="movie__overview">
          {movie.overview.length > 160
            ? `${movie.overview.slice(0, movie.overview.indexOf(' ', 160))}...`
            : movie.overview}
        </Paragraph>
        <Rate
          className="movie__rate"
          count="10"
          allowHalf
          value={movie.rating || rating[movie.id]}
          onChange={(value) => {
            rate(movie.id, value);
          }}
        />
      </div>
    </div>
  );
}
