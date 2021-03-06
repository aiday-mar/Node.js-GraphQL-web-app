// import React and our routing dependencies
import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

// import our shared layout component
import Layout from '../components/Layout';

// import our routes
import Home from './home';
import MyNotes from './mynotes';
import MyCourses from './mycourses';
import Favorites from './favorites';
import Note from './note';
import SignUp from './signup';
import SignIn from './signin';
import NewNote from './new';
import EditNote from './edit';

const IS_LOGGED_IN = gql`
  {
    isLoggedIn @client
  }
`;

// define our routes in the BrowserRouter
const Pages = () => {
  return (
    <Router>
      <Layout>
        <Route exact path="/" component={Home} />
        <PrivateRoute path="/mynotes" component={MyNotes} />
        <PrivateRoute path="/favorites" component={Favorites} />
        <PrivateRoute path="/mycourses" component={MyCourses} />
        <Route path="/note/:id" component={Note} />
        <Route path="/signup" component={SignUp} />
        <Route path="/signin" component={SignIn} />
        <PrivateRoute path="/new" component={NewNote} />
        <PrivateRoute path="/edit/:id" component={EditNote} />
      </Layout>
    </Router>
  );
};

// useQuery example : https://www.apollographql.com/docs/react/data/queries/
// the private route component indeed does take a component prop 

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { loading, error, data } = useQuery(IS_LOGGED_IN);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;
  
  // suppose that we are logged in then we can render the component with all the associated props
  // otherwise if we are not logged in, we need to redirect to the sign in page
  return (
    <Route
      {...rest}
      render={props =>
        data.isLoggedIn === true ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/signin',
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
};

export default Pages;
