// In here we define the mutations we can use on the database 

module.exports = {
  // Resolve the author info for a note when requested
  author: async (note, args, { models }) => {
    return await models.User.findById(note.author);
  },
  // Resolved the favoritedBy info for a note when requested
  // We fin the ids of the users such that they are in the favoritedBy array of the note 
  favoritedBy: async (note, args, { models }) => {
    return await models.User.find({ _id: { $in: note.favoritedBy } });
  },

  // course
  course: async (note, args, { models }) => {
    return await models.Course.find({ name: note.course });
  },
};
