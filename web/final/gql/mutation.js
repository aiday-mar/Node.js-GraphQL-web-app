import { gql } from '@apollo/client';

// The mutation is named with capital letters, the qgl command is written within single quotes
const NEW_NOTE = gql`
  mutation newNote($content: String!, $course: String!) {
    newNote(content: $content, course : $course) {
      id
      content
      createdAt
      favoriteCount
      favoritedBy {
        id
        username
      }
      author {
        username
        id
      }
      course {
        name
      }
    }
  }
`;

const EDIT_NOTE = gql`
  mutation updateNote($id: ID!, $content: String!) {
    updateNote(id: $id, content: $content) {
      id
      content
      createdAt
      favoriteCount
      favoritedBy {
        id
        username
      }
      author {
        username
        id
      }
    }
  }
`;

// when you delete a note here, you do not return anything
const DELETE_NOTE = gql`
  mutation deleteNote($id: ID!) {
    deleteNote(id: $id)
  }
`;

// after you toggle or untoggle the favorite you want to show the id of the object which has been updated as well as the new favoriteCount
const TOGGLE_FAVORITE = gql`
  mutation toggleFavorite($id: ID!) {
    toggleFavorite(id: $id) {
      id
      favoriteCount
    }
  }
`;

const SIGNIN_USER = gql`
  mutation signIn($email: String, $password: String!) {
    signIn(email: $email, password: $password)
  }
`;

const SIGNUP_USER = gql`
  mutation signUp($email: String!, $username: String!, $password: String!) {
    signUp(email: $email, username: $username, password: $password)
  }
`;

// --- course --
const ADD_COURSE = gql`
  mutation addCourse($name: String!) {
    addCourse(name: $name) {
      name
    }
  }
`;

export {
  NEW_NOTE,
  EDIT_NOTE,
  DELETE_NOTE,
  TOGGLE_FAVORITE,
  SIGNIN_USER,
  SIGNUP_USER,

  ADD_COURSE
};
