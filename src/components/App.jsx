import { Component } from 'react';
import { Layout, Tabs, Pagination, Alert } from 'antd';

import TabSearch from './TabSearch';

const { Content } = Layout;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      totalPages: 1,
      query: 'return',
      currentPage: 1,
      genres: [],
      isLoading: true,
      onError: null,
      isOffline: false,
    };
    this.api = 'https://api.themoviedb.org/3';
    this.apiKey = 'api_key=851fa7c4133df64b24b316353457d809';
  }

  componentDidMount() {
    const { query, currentPage } = this.state;
    window.onoffline = () => {
      this.setState({ isOffline: true });
    };
    window.ononline = () => {
      this.setState({ isOffline: false });
    };
    fetch(`${this.api}/search/movie?${this.apiKey}&query=${query}&page=${currentPage}`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error(res.status);
      })
      .then((movies) => this.setState({ movies: movies.results, totalPages: movies.total_pages, isLoading: false }))
      .catch((error) => this.setState({ onError: error, isLoading: false }));
    fetch(`${this.api}/genre/movie/list?${this.apiKey}`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error(res.status);
      })
      .then(({ genres }) => this.setState({ genres }))
      .catch((error) => this.setState({ onError: error, isLoading: false }));
  }

  componentDidUpdate() {
    const { query, currentPage } = this.state;
    fetch(`${this.api}/search/movie?${this.apiKey}&query=${query}&page=${currentPage}`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error(res.status);
      })
      .then((movies) => this.setState({ movies: movies.results, totalPages: movies.total_pages, isLoading: false }))
      .catch((error) => this.setState({ onError: error, isLoading: false }));
  }

  onChange = (value) => this.setState({ currentPage: value });

  onSearch = (event) => this.setState({ query: event.target.value || 'return' });

  render() {
    const { movies, genres, isLoading, onError, isOffline, totalPages, currentPage } = this.state;

    return (
      <Layout>
        <Content>
          {onError && <Alert message="Ошибка" description={onError.message} type="error" showIcon />}
          {isOffline && <Alert message="Пропало подключении к сети" type="error" showIcon />}
          <Tabs
            defaultActiveKey="1"
            centered="true"
            items={[
              {
                label: 'Search',
                key: '1',
                children: (
                  <TabSearch
                    movies={movies}
                    genres={genres}
                    isLoading={isLoading}
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onChange={this.onChange}
                    onSearch={this.onSearch}
                  />
                ),
              },
              {
                label: 'Rated',
                key: '2',
                children: <Pagination defaultCurrent={1} total={totalPages} pageSize={1} showSizeChanger={false} />,
              },
            ]}
          />
        </Content>
      </Layout>
    );
  }
}
