import { Component } from 'react';
import { Layout, Tabs, Pagination, Alert } from 'antd';

import TabSearch from './TabSearch';

const { Content } = Layout;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      genres: [],
      isLoading: true,
      isError: null,
      isOffline: false,
    };
  }

  componentDidMount() {
    window.onoffline = () => {
      this.setState({ isOffline: true });
    };
    window.ononline = () => {
      this.setState({ isOffline: false });
    };
    fetch('https://api.themoviedb.org/3/search/movie?api_key=851fa7c4133df64b24b316353457d809&query=return')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error(res.status);
      })
      .then((movies) => this.setState({ movies: movies.results, isLoading: false }))
      .catch((error) => this.setState({ isError: error, isLoading: false }));
    fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=851fa7c4133df64b24b316353457d809')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error(res.status);
      })
      .then(({ genres }) => this.setState({ genres }))
      .catch((error) => this.setState({ isError: error, isLoading: false }));
  }

  render() {
    const { movies, genres, isLoading, isError, isOffline } = this.state;

    return (
      <Layout>
        <Content>
          {isError && <Alert message="Ошибка" description={isError.message} type="error" showIcon />}
          {isOffline && <Alert message="Пропало подключении к сети" type="error" showIcon />}
          <Tabs
            defaultActiveKey="1"
            centered="true"
            items={[
              {
                label: 'Search',
                key: '1',
                children: <TabSearch movies={movies} genres={genres} isLoading={isLoading} />,
              },
              {
                label: 'Rated',
                key: '2',
                children: <Pagination defaultCurrent={1} total={50} />,
              },
            ]}
          />
        </Content>
      </Layout>
    );
  }
}
