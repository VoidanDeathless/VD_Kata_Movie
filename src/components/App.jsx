import { Component } from 'react';
import { Layout, Tabs, Pagination } from 'antd';

import TabSearch from './TabSearch';

const { Content } = Layout;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      genres: [],
    };
  }

  componentDidMount() {
    fetch('https://api.themoviedb.org/3/search/movie?api_key=851fa7c4133df64b24b316353457d809&query=return')
      .then((res) => res.json())
      .then((movies) => this.setState({ movies: movies.results }));
    fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=851fa7c4133df64b24b316353457d809')
      .then((res) => res.json())
      .then(({ genres }) => this.setState({ genres }));
  }

  render() {
    const { movies, genres } = this.state;

    return (
      <Layout>
        <Content>
          <Tabs
            defaultActiveKey="1"
            centered="true"
            items={[
              {
                label: 'Search',
                key: '1',
                children: <TabSearch movies={movies} genres={genres} />,
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
