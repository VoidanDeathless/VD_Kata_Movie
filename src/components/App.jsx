import { Component } from 'react';
import { Layout, Tabs, Alert, Spin } from 'antd';

import getGenres from '../services/getGenres';
import getSessionId from '../services/getSessionId';
import getRatedMovies from '../services/getRatedMovies';

import GenresContext from './GenresContext';
import TabSearch from './TabSearch';
import TabRated from './TabRated';

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
      ratedCurrentPage: 1,
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
      getGenres()
        .then(({ genres }) => this.setState({ genres }))
        .catch((error) => this.setState({ onError: error })),

      getSessionId()
        .then((session) => this.setState({ guestSessionId: session.guest_session_id }))
        .catch((error) => this.setState({ onError: error })),
    ]).then(this.setState({ isLoading: false }));
  }

  componentDidUpdate(prevProps, prevState) {
    const { guestSessionId, ratedCurrentPage } = this.state;

    if (prevState.ratedCurrentPage !== ratedCurrentPage) {
      getRatedMovies(guestSessionId, ratedCurrentPage).then((movies) =>
        this.setState({
          ratedMovies: movies.results,
          ratedTotalPages: movies.total_pages,
          isLoading: false,
        })
      );
    }
  }

  onRate = (movieId, value) => {
    const { guestSessionId, ratedCurrentPage } = this.state;
    getRatedMovies(guestSessionId, ratedCurrentPage)
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

  onChange = (value) => this.setState({ ratedCurrentPage: value });

  render() {
    const {
      genres,
      onError,
      isOffline,
      guestSessionId,
      isLoading,
      ratedMovies,
      ratedTotalPages,
      rating,
      ratedCurrentPage,
    } = this.state;

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
                        ratedCurrentPage={ratedCurrentPage}
                        onChange={this.onChange}
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
