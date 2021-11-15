import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import CourseComponent from '../components/CourseComponent';
import { GET_MY_COURSES } from '../gql/query';

const MyCourses = () => {
  useEffect(() => {
    document.title = 'My Courses';
  });

  const { loading, error, data } = useQuery(GET_MY_COURSES);

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;
  if (data.courses.length !== 0) {
    return <CourseComponent notes={data.courses} />;
  } else {
    return <p>No courses yet</p>;
  }
};

export default MyCourses;
