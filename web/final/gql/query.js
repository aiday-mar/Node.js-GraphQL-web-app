import { gql } from '@apollo/client';
// queries are different from mutations in that they do not change the state of the database

// you need to keep track if there is more data that we could load, and we should keep an array of notes too
const GET_NOTES = gql`
  query noteFeed($cursor: String) {
    noteFeed(cursor: $cursor) {
      cursor
      hasNextPage
      notes {
        id
        createdAt
        content
        favoriteCount
        author {
          username
          id
          avatar
        }
        course {
          id
          name
          favoriteCount
        }
      }
    }
  }
`;

const GET_NOTE = gql`
  query note($id: ID!) {
    note(id: $id) {
      id
      createdAt
      content
      favoriteCount
      author {
        username
        id
        avatar
      }
      course {
        id
        name
        favoriteCount
      }
    }
  }
`;

const GET_MY_NOTES = gql`
  query me {
    me {
      id
      username
      notes {
        id
        createdAt
        content
        favoriteCount
        author {
          username
          id
          avatar
        }
        course {
          id
          name
          favoriteCount
        }
      }
    }
  }
`;

const GET_MY_FAVORITES = gql`
  query me {
    me {
      id
      username
      email
      favorites {
        id
        createdAt
        content
        favoriteCount
        author {
          username
          id
          avatar
        }
        course {
          id
          name
          favoriteCount
        }
      }
      courses {
        id
        name
        favoriteCount
      }
    }
  }
`;

const GET_ME = gql`
  query me {
    me {
      id
      favorites {
        id
      }
      courses {
        id
      }
    }
  }
`;

const GET_MY_PROFILE = gql`
  query me {
    me {
      id
      username
      email
    }
  }
`;

const IS_LOGGED_IN = gql`
  {
    isLoggedIn @client
  }
`;

const GET_COURSES = gql`
  query allcourses {
    allcourses {
      id
      name
      favoriteCount
    }
  }
`;

const GET_MY_COURSES = gql`
  query me {
    me {
      id
      username
      courses {
        id
        name
        favoriteCount
      }
    }
  }
`;

export {
  GET_NOTES,
  GET_NOTE,
  GET_MY_NOTES,
  GET_MY_FAVORITES,
  GET_ME,
  GET_MY_PROFILE,
  IS_LOGGED_IN,
  // --- courses ---
  GET_MY_COURSES,
  GET_COURSES
};
