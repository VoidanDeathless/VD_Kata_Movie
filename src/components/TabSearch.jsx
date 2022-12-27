import { Component } from 'react';
import { Space, Row, Col, Input, Pagination, Spin, Alert } from 'antd';
import debounce from 'lodash.debounce';

import api from './Api';
import Movie from './Movie';

const { Search } = Input;

export default class TabSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      totalPages: 1,
      query: 'return',
      currentPage: 1,
      isLoading: true,
      onError: null,
    };
  }

  componentDidMount() {
    const { query, currentPage } = this.state;

    fetch(`${api.url}/search/movie?${api.key}&query=${query}&page=${currentPage}`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error(res.status);
      })
      .then((movies) => this.setState({ movies: movies.results, totalPages: movies.total_pages, isLoading: false }))
      .catch((error) => this.setState({ onError: error, isLoading: false }));
  }

  componentDidUpdate(prevProps, prevState) {
    const { query, currentPage } = this.state;

    if (prevState.query !== query || prevState.currentPage !== currentPage) {
      fetch(`${api.url}/search/movie?${api.key}&query=${query}&page=${currentPage}`)
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error(res.status);
        })
        .then((movies) => this.setState({ movies: movies.results, totalPages: movies.total_pages, isLoading: false }))
        .catch((error) => this.setState({ onError: error, isLoading: false }));
    }
  }

  onChange = (value) => this.setState({ currentPage: value });

  onSearch = (event) => this.setState({ query: event.target.value || 'return', currentPage: 1 });

  render() {
    const { movies, isLoading, totalPages, currentPage, onError } = this.state;
    const { guestSessionId, onRate, rating } = this.props;
    return (
      <Space direction="vertical" size={32}>
        <Search placeholder="Type to search..." onChange={debounce(this.onSearch, 500)} />
        {onError && <Alert message="Ошибка" description={onError.message} type="error" showIcon />}
        <Row gutter={[32, 32]}>
          {isLoading && <Spin />}
          {movies.map((movie) => (
            <Col key={movie.id} lg={{ span: 12 }} span={24}>
              <Movie movie={movie} guestSessionId={guestSessionId} onRate={onRate} rating={rating} />
            </Col>
          ))}
          {!totalPages && 'По вашему запросу ничего не найдено'}
        </Row>
        <Pagination
          current={currentPage}
          total={totalPages}
          pageSize={1}
          showSizeChanger={false}
          onChange={this.onChange}
        />
      </Space>
    );
  }
}
