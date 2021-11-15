const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    
    favoriteCount: {
      type: Number,
      default: 0
    },

    favoritedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
  }
);

const Course = mongoose.model('Course', CourseSchema);
module.exports = Course;
