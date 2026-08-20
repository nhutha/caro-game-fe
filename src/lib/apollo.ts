import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { API_ENDPOINTS } from './constants';

const httpLink = createHttpLink({
  uri: API_ENDPOINTS.GRAPHQL,
});

const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const apolloClient = new ApolloClient({
  link: from([authLink.concat(httpLink)]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

export default apolloClient;
