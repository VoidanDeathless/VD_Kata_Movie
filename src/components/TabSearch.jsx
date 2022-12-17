import { Space, Row, Col, Input, Pagination, Spin } from 'antd';

import Movie from './Movie';

const { Search } = Input;

export default function TabSearch({ movies, genres, isLoading }) {
  return (
    <Space direction="vertical" size={32}>
      <Search placeholder="Type to search..." />
      <Row gutter={[32, 32]}>
        {isLoading && <Spin />}
        {movies.map((movie) => (
          <Col key={movie.id} lg={{ span: 12 }} span={24}>
            <Movie movie={movie} genres={genres} />
          </Col>
        ))}
      </Row>
      <Pagination defaultCurrent={1} total={50} />
    </Space>
  );
}
