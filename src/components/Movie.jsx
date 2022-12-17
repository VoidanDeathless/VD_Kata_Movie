import { Image, Typography, Tag, Rate } from 'antd';
import { format } from 'date-fns';

const { Title, Paragraph, Text } = Typography;

export default function Movie({ movie, genres }) {
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
        <Paragraph className="movie__tags">
          {genres.map((genre) => movie.genre_ids.includes(genre.id) && <Tag key={genre.id}>{genre.name}</Tag>)}
        </Paragraph>
      </header>
      <div className="movie__score">{movie.vote_average}</div>
      <div className="movie__description">
        <Paragraph className="movie__overview">
          {movie.overview.length > 160
            ? `${movie.overview.slice(0, movie.overview.indexOf(' ', 160))}...`
            : movie.overview}
        </Paragraph>
        <Rate className="movie__rate" count="10" allowHalf defaultValue={movie.vote_average} />
      </div>
    </div>
  );
}
