module.exports = {
  // Resolve the list of notes for a user when requested
  notes: async (user, args, { models }) => {
    // finding the notes, where the author is equal to the current user id
    return await models.Note.find({ author: user._id }).sort({ _id: -1 });
  },
  // Resolve the list of favorites for a user when requested
  favorites: async (user, args, { models }) => {
    return await models.Note.find({ favoritedBy: user._id }).sort({ _id: -1 });
  },

  // my courses 
  mycourses: async (user, args, { models }) => {
    return await user.courses;
  },
};

