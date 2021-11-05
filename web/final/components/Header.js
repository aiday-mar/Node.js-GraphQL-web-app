import React from 'react';
import styled from 'styled-components';
import logo from '../img/logo.svg';
import { useQuery } from '@apollo/client';
import { Link, withRouter } from 'react-router-dom';
import ButtonAsLink from './ButtonAsLink';
import { IS_LOGGED_IN } from '../gql/query';
import { GET_MY_PROFILE } from '../gql/query';

const HeaderBar = styled.header`
  width: 100%;
  padding: 0.5em 1em;
  display: flex;
  height: 64px;
  position: fixed;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.25);
  z-index: 1;
`;

const LogoText = styled.h1`
  margin: 0;
  padding: 0;
  display: inline;
`;

const UserState = styled.div`
  margin-left: auto;
`;


const Header = props => {
  // query hook for user logged in state
  const { data, client } = useQuery(IS_LOGGED_IN);

  // solve this when figured out why it gives undefined 
  const { loading, error, myData } = useQuery(GET_MY_PROFILE);
  // console.log(myData.me.id);

  return (
    <HeaderBar>
      <img src="https://img.icons8.com/ios-glyphs/30/000000/student-center.png" style={{marginRight:40}}/>
      <LogoText>Study Better</LogoText>
      {/* If logged in display a log out link, else display sign in options */}
      <UserState>
        {data.isLoggedIn ? (
			<React.Fragment>
				<ButtonAsLink
				onClick={() => {
				  // remove the token
				  localStorage.removeItem('token');
				  // clear the application's cache
				  client.resetStore();
				  // update local state
				  client.writeData({ data: { isLoggedIn: false } });
				  // redirect the user to the homepage
				  props.history.push('/');
				}}
				>
				Logout
			  </ButtonAsLink>
		  </React.Fragment>
        ) : (
          <p>
            <Link to={'/signin'}>Sign In</Link> or{' '}
            <Link to={'/signup'}>Sign Up</Link>
          </p>
        )}
      </UserState>
    </HeaderBar>
  );
};

export default withRouter(Header);
