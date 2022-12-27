import { Component } from 'react';
import { Layout, Tabs, Alert, Spin } from 'antd';

import GenresContext from './GenresContext';
import TabSearch from './TabSearch';
import TabRated from './TabRated';
import api from './Api';

const { Content } = Layout;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      genres: [],
      guestSessionId: null,
      onError: null,
      isOffline: false,
      isLoading: true,
      ratedMovies: [],
      ratedTotalPages: 0,
      rating: {},
    };
  }

  componentDidMount() {
    window.onoffline = () => {
      this.setState({ isOffline: true });
    };

    window.ononline = () => {
      this.setState({ isOffline: false });
    };
    Promise.all([
      fetch(`${api.url}/genre/movie/list?${api.key}`)
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error(res.status);
        })
        .then(({ genres }) => this.setState({ genres }))
        .catch((error) => this.setState({ onError: error })),

      fetch(`${api.url}/authentication/guest_session/new?${api.key}`)
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error(res.status);
        })
        .then((session) => this.setState({ guestSessionId: session.guest_session_id }))
        .catch((error) => this.setState({ onError: error })),
    ]).then(this.setState({ isLoading: false }));
  }

  onRate = (movieId, value) => {
    const { guestSessionId } = this.state;
    fetch(`${api.url}/guest_session/${guestSessionId}/rated/movies?${api.key}`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error(res.status);
      })
      .then((movies) =>
        this.setState({
          ratedMovies: movies.results,
          ratedTotalPages: movies.total_pages,
          isLoading: false,
        })
      )
      .then(
        this.setState((state) => ({
          rating: {
            ...state.rating,
            [movieId]: value,
          },
        }))
      )
      .catch((error) => this.setState({ onError: error }));
  };

  render() {
    const { genres, onError, isOffline, guestSessionId, isLoading, ratedMovies, ratedTotalPages, rating } = this.state;

    return (
      <GenresContext.Provider value={genres}>
        <Layout>
          <Content>
            {isLoading && <Spin />}
            {onError && <Alert message="Ошибка" description={onError.message} type="error" showIcon />}
            {isOffline && <Alert message="Пропало подключении к сети" type="error" showIcon />}
            {guestSessionId && (
              <Tabs
                defaultActiveKey="1"
                centered="true"
                items={[
                  {
                    label: 'Search',
                    key: '1',
                    children: <TabSearch guestSessionId={guestSessionId} onRate={this.onRate} rating={rating} />,
                    onTabClick: this.onRate,
                  },
                  {
                    label: 'Rated',
                    key: '2',
                    children: (
                      <TabRated
                        guestSessionId={guestSessionId}
                        onRate={this.onRate}
                        ratedMovies={ratedMovies}
                        ratedTotalPages={ratedTotalPages}
                      />
                    ),
                  },
                ]}
              />
            )}
          </Content>
        </Layout>
      </GenresContext.Provider>
    );
  }
}
