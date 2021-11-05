// File is imported as a script in the main index.js file 

import React from 'react';
import ReactDOM from 'react-dom';
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache
} from '@apollo/client';
import { setContext } from 'apollo-link-context';

// import global styles
import GlobalStyle from '/components/GlobalStyle';

// import our routes
import Pages from '/pages';

// configure our API URI & cache
const uri = process.env.API_URI;
const httpLink = createHttpLink({ uri });
const cache = new InMemoryCache();

// return the headers to the context
// local storage: https://blog.logrocket.com/localstorage-javascript-complete-guide/
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: localStorage.getItem('token') || ''
    }
  };
});

// create the Apollo client
// The link is made of a header and a uri, example : https://hasura.io/learn/graphql/react/apollo-client/
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
  resolvers: {},
  connectToDevTools: true
});

// check for a local token
const data = {
  isLoggedIn: !!localStorage.getItem('token')
};

// write the cache data on initial load
cache.writeData({ data });

// write the cache data after cache is reset
client.onResetStore(() => cache.writeData({ data }));

// ApolloProvider wraps your React app and places Apollo Client on the context, which enables you to access it from anywhere in your component tree
// The global styles are also imported and they are used throughout the whole project 
const App = () => {
  return (
    <ApolloProvider client={client}>
      <GlobalStyle />
      <Pages />
    </ApolloProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
