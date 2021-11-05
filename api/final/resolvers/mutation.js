const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  AuthenticationError,
  ForbiddenError
} = require('apollo-server-express');
const mongoose = require('mongoose');
require('dotenv').config();
const gravatar = require('../util/gravatar');

module.exports = {
  newNote: async (parent, args, { models, user }) => {
    
    // If the current user does not exist yet, then we throw an authentication error
    if (!user) {
      throw new AuthenticationError('You must be signed in to create a note');
    }

    // adding the course
    models.Course.create({
      name: args.course
    })

    // Otherwise we access the Note model, and inside we create a new note with 
    // the content being the content of the argument and the author is the id of the current user
    return await models.Note.create({
      content: args.content,
      author: mongoose.Types.ObjectId(user.id),
      favoriteCount: 0,
      // adding the course
      course: args.course,
    });
  },

  // ADD THE POSSIBILITY TO ADD COURSES

  deleteNote: async (parent, { id }, { models, user }) => {
    // if not a user, throw an Authentication Error
    if (!user) {
      throw new AuthenticationError('You must be signed in to delete a note');
    }

    // find the note using the findById function of the Node model
    // await literally suspends the function execution until the promise settles, and then resumes it with the promise result.
    const note = await models.Note.findById(id);
    
    // if the note owner and current user don't match, throw a forbidden error
    // You can access the note ownor by writing note.author, where note is a Note
    if (note && String(note.author) !== user.id) {
      throw new ForbiddenError("You don't have permissions to delete the note");
    }

    try {
      // if everything checks out, remove the note
      await note.remove();
      return true;
    } catch (err) {
      // if there's an error along the way, return false
      return false;
    }
  },
  updateNote: async (parent, { content, id }, { models, user }) => {
    // if not a user, throw an Authentication Error
    if (!user) {
      throw new AuthenticationError('You must be signed in to update a note');
    }

    // find the note
    const note = await models.Note.findById(id);
    // if the note owner and current user don't match, throw a forbidden error
    if (note && String(note.author) !== user.id) {
      throw new ForbiddenError("You don't have permissions to update the note");
    }

    // Update the note in the db and return the updated note
    // await forces the process to run this function before running anything else 
    return await models.Note.findOneAndUpdate(
      {
        _id: id
      },
      {
        $set: {
          // we're setting a new content 
          content
        }
      },
      {
        new: true
      }
    );
  },
  
  toggleFavorite: async (parent, { id }, { models, user }) => {
    // if no user context is passed, throw auth error
    if (!user) {
      throw new AuthenticationError();
    }

    // check to see if the user has already favorited the note
    let noteCheck = await models.Note.findById(id);
    
    // once the note is found, you can check if in that note, you can find the user.id, and which index it would have in that case 
    const hasUser = noteCheck.favoritedBy.indexOf(user.id);

    // if the user exists in the list
    // pull them from the list and reduce the favoriteCount by 1
    if (hasUser >= 0) {
      return await models.Note.findByIdAndUpdate(
        id,
        {
          $pull: {
            // we remove the user.id from the favoritedBy array
            favoritedBy: mongoose.Types.ObjectId(user.id)
          },
          $inc: {
            // we decrement the favoriteCount by one 
            favoriteCount: -1
          }
        },
        {
          // Set new to true to return the updated doc
          new: true
        }
      );
    } else {
      // if the user doesn't exists in the list
      // add them to the list and increment the favoriteCount by 1
      return await models.Note.findByIdAndUpdate(
        id,
        {
          $push: {
            // otherwise we push the user.id into the favoritedBy array
            favoritedBy: mongoose.Types.ObjectId(user.id)
          },
          $inc: {
            favoriteCount: 1
          }
        },
        {
          new: true
        }
      );
    }
  },

  addCourse: async (parent, { name }, { models, user }) => {

    if (!user) {
      throw new AuthenticationError();
    }

    const hasCourse = user.courses.indexOf(name);

    if (hasCourse >= 0) {
      return user.courses;
    } else {
      // if the course doesn't exist in the user array then add it
      return await models.User.findByIdAndUpdate(
        user.id,
        {
          $push: {
            courses: name
          }
        },
        {
          new: true
        }
      );
    }
  },

  signUp: async (parent, { username, email, password }, { models }) => {
    // normalize email address
    email = email.trim().toLowerCase();
    // hash the password
    const hashed = await bcrypt.hash(password, 10);
    // create the gravatar url from the trimmed and lower case email
    const avatar = gravatar(email);
    try {
      // creating a new user in the User model
      const user = await models.User.create({
        username,
        email,
        avatar,
        password: hashed
      });

      // create and return the json web token using the JWT_SECRET defined in the .env file 
      return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    } catch (err) {
      // if there's a problem creating the account, throw an error
      throw new Error('Error creating account');
    }
  },

  signIn: async (parent, { username, email, password }, { models }) => {
    if (email) {
      // normalize email address
      email = email.trim().toLowerCase();
    }

    // we find in the User model, either the email or the username we have been provided with 
    const user = await models.User.findOne({
      $or: [{ email }, { username }]
    });

    // if no user is found, throw an authentication error
    if (!user) {
      throw new AuthenticationError('Error signing in');
    }

    // if the passwords don't match, throw an authentication error
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new AuthenticationError('Error signing in');
    }

    // create and return the json web token
    // for this we need the id associated to the user 
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  }
};
