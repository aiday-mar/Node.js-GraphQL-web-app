const { gql } = require('apollo-server-express');

module.exports = gql`
  scalar DateTime

  type Course {
    id: ID!
    name: String!
    favoriteCount: Int!
    favoritedBy: [User]
  }

  type Note {
    id: ID!
    content: String!
    author: User!
    favoriteCount: Int!
    favoritedBy: [User]
    createdAt: DateTime!
    updatedAt: DateTime!

    course: Course
  }

  type User {
    id: ID!
    username: String!
    email: String!
    avatar: String

    notes: [Note!]!
    favorites: [Note!]!

    courses: [Course!]!
  }

  type NoteFeed {
    notes: [Note]!
    cursor: String!
    hasNextPage: Boolean!
  }

  type Query {
    allcourses: [Course]

    notes: [Note!]!
    note(id: ID): Note!
    user(username: String!): User
    users: [User!]!
    me: User!
    noteFeed(cursor: String): NoteFeed
  }

  type Mutation {
    addCourse(name : String!): Course
    deleteCourse(id: ID!): Boolean!

    newNote(content: String!, course: String!): Note
    deleteNote(id: ID!): Boolean!
    updateNote(id: ID!, content: String!, course: String!): Note!

    toggleFavorite(id: ID!): Note!
    toggleFavoriteCourse(id: ID!): Course!

    signUp(username: String!, email: String!, password: String!): String!
    signIn(username: String, email: String, password: String!): String!
  }
`;
