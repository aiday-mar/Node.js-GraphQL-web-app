module.exports = {
    favoritedBy: async (course, args, { models }) => {
        return await models.User.find({ _id: { $in: course.favoritedBy } });
    },
};