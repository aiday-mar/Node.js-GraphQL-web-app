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
  // VERIFIED : { "_id" : ObjectId("619268d5315dcd3d70d20390"), "favoriteCount" : 0, "favoritedBy" : [ ], "name" : "GraphQL fundamentals", "__v" : 0 }
  addCourse: async (parent, args, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be signed in to add a course');
    }

    return await models.Course.create({
      name: args.name,
      favoriteCount: 0
    });
  },

  // VERIFIED
  deleteCourse: async (parent, { id }, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be signed in to delete a course');
    }

    const course = await models.Course.findById(id);

    try {
      await course.remove();
      return true;
    } catch (err) {
      return false;
    }
  },

  // --- when you add a note, you need the content and the name of the course ---
  // VERIFIED
  newNote: async (parent, args, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be signed in to create a note');
    }

    var courseId = '0';

    await models.Course.find({ name: args.course }, async function(err, docs) {
      if (!docs.length) {
        await models.Course.create({
          name: args.course,
          favoriteCount: 0
        });
      }
    });

    await models.Course.find({ name: args.course }, async function(err, docs) {
      courseId = docs[0].id;
    });

    return await models.Note.create({
      content: args.content,
      author: mongoose.Types.ObjectId(user.id),
      favoriteCount: 0,
      course: courseId //mongoose.Types.ObjectId(courseId)
    });
  },

  deleteNote: async (parent, { id }, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be signed in to delete a note');
    }

    const note = await models.Note.findById(id);

    if (note && String(note.author) !== user.id) {
      throw new ForbiddenError("You don't have permissions to delete the note");
    }

    try {
      await note.remove();
      return true;
    } catch (err) {
      return false;
    }
  },

  // VERIFIED - although need to run twice in gql playground for it to return correctly?
  updateNote: async (parent, { id, content, course }, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('You must be signed in to update a note');
    }

    const note = await models.Note.findById(id);

    if (note && String(note.author) !== user.id) {
      throw new ForbiddenError("You don't have permissions to update the note");
    }

    var courseId = '0';

    await models.Course.find({ name: course }, async function(err, docs) {
      if (!docs.length) {
        await models.Course.create({
          name: course,
          favoriteCount: 0
        });

        await models.Course.find({ name: course }, function(err, res) {
          courseId = res[0].id;
        });
      } else {
        courseId = docs[0].id;
      }
    });

    return await models.Note.findOneAndUpdate(
      {
        _id: id
      },
      {
        $set: {
          content: content,
          course: mongoose.Types.ObjectId(courseId)
        }
      },
      {
        new: true
      }
    );
  },

  // NOT CHANGED
  toggleFavorite: async (parent, { id }, { models, user }) => {
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

  // VERIFIED
  toggleFavoriteCourse: async (parent, { id }, { models, user }) => {
    if (!user) {
      throw new AuthenticationError();
    }

    let courseCheck = await models.Course.findById(id);
    const hasUser = courseCheck.favoritedBy.indexOf(user.id);

    if (hasUser >= 0) {
      return await models.Course.findByIdAndUpdate(
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
      return await models.Course.findByIdAndUpdate(
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

  // METHODS not changed
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
