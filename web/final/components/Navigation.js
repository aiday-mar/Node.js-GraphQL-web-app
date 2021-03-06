import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useQuery } from '@apollo/client';
import { IS_LOGGED_IN } from '../gql/query';

const Nav = styled.nav`
  padding: 1em;
  background: #871F78  ;

  @media (max-width: 700px) {
    padding-top: 64px;
  }

  @media (min-width: 700px) {
    position: fixed;
    width: 220px;
    height: calc(100% - 64px);
    overflow-y: scroll;
  }
`;

const NavList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  line-height: 2;

  a {
    text-decoration: none;
    font-weight: bold;
    font-size: 1.1em;
    color: #ffffff;
  }

  a:visited {
    color: #ffffff;
  }

  a:hover,
  a:focus {
    color: #ffffff;
  }
`;

const Navigation = () => {
  const { loading, error, data } = useQuery(IS_LOGGED_IN);

  return (
    <Nav>
      <NavList>
        <li>
          <Link to="/">
            Home
          </Link>
        </li>
        {data.isLoggedIn ? 
        (<React.Fragment>
        <li>
          <Link to="/mycourses">
            My Courses
          </Link>
        </li>
        <li>
          <Link to="/mynotes">
            My Notes
          </Link>
        </li>
        <li>
          <Link to="/favorites">
            Favorite Notes
          </Link>
        </li>
        <li>
          <Link to="/new">
            New Note
          </Link>
        </li>
        </React.Fragment>) :
        (<li><Link to="/signin">Login</Link></li>)}
      </NavList>
    </Nav>
  );
};

export default Navigation;
