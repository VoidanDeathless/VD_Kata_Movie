import { Component } from 'react';
import { Space, Row, Col, Pagination, Alert } from 'antd';

import Movie from './Movie';

export default class TabRated extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onError: null,
    };
  }

  render() {
    const { onError } = this.state;
    const { guestSessionId, onRate, ratedMovies, ratedTotalPages, onChange, ratedCurrentPage } = this.props;

    return (
      <Space direction="vertical" size={32}>
        {onError && <Alert message="Ошибка" description={onError.message} type="error" showIcon />}
        <Row gutter={[32, 32]}>
          {!ratedMovies.length && 'Нет оценённых фильмов'}
          {ratedMovies.map((movie) => (
            <Col key={movie.id} lg={{ span: 12 }} span={24}>
              <Movie movie={movie} guestSessionId={guestSessionId} onRate={onRate} />
            </Col>
          ))}
        </Row>
        {ratedTotalPages > 1 && (
          <Pagination
            current={ratedCurrentPage}
            total={ratedTotalPages}
            pageSize={1}
            showSizeChanger={false}
            onChange={(value) => onChange(value)}
          />
        )}
      </Space>
    );
  }
}
