// Here we define query functions, which do not change the database 

module.exports = {
  notes: async (parent, args, { models }) => {
    return await models.Note.find().limit(100);
  },
  note: async (parent, args, { models }) => {
    return await models.Note.findById(args.id);
  },
  user: async (parent, args, { models }) => {
    // Here args means the arguments passed to the query function
    return await models.User.findOne({ username: args.username });
  },
  users: async (parent, args, { models }) => {
    return await models.User.find({}).limit(100);
  },
  me: async (parent, args, { models, user }) => {
    return await models.User.findById(user.id);
  },
  noteFeed: async (parent, { cursor }, { models }) => {
    // hard code the limit to 10 items
    const limit = 10;
    // set the default hasNextPage value to false
    let hasNextPage = false;
    // if no cursor is passed the default query will be empty
    // this will pull the newest notes from the db
    let cursorQuery = {};

    // if there is a cursor
    // our query will look for notes with an ObjectId less than that of the cursor
    // _id will make sense in the context of the models.Note
    if (cursor) {
      cursorQuery = { _id: { $lt: cursor } };
    }

    // find the limit + 1 of notes in our db, sorted newest to oldest meaning in decreasing order of time
    let notes = await models.Note.find(cursorQuery)
      .sort({ _id: -1 })
      .limit(limit + 1);

    // if the number of notes we find exceeds our limit, since indeed we should have limit + 1 elements in the notes 
    // set hasNextPage to true & trim the notes to the limit
    if (notes.length > limit) {
      hasNextPage = true;
      notes = notes.slice(0, -1);
    }

    // the new cursor will be the Mongo ObjectID of the last item in the feed array
    const newCursor = notes[notes.length - 1]._id;

    return {
      notes,
      cursor: newCursor,
      hasNextPage
    };
  }
};
