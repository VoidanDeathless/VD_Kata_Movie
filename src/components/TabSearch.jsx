import { Space, Row, Col, Input, Pagination, Spin } from 'antd';
import debounce from 'lodash.debounce';

import Movie from './Movie';

const { Search } = Input;

export default function TabSearch({ movies, genres, isLoading, totalPages, currentPage, onChange, onSearch }) {
  return (
    <Space direction="vertical" size={32}>
      <Search placeholder="Type to search..." onChange={debounce(onSearch, 500)} />
      <Row gutter={[32, 32]}>
        {isLoading && <Spin />}
        {movies.map((movie) => (
          <Col key={movie.id} lg={{ span: 12 }} span={24}>
            <Movie movie={movie} genres={genres} />
          </Col>
        ))}
        {!totalPages && 'По вашему запросу ничего не найдено'}
      </Row>
      <Pagination current={currentPage} total={totalPages} pageSize={1} showSizeChanger={false} onChange={onChange} />
    </Space>
  );
}
