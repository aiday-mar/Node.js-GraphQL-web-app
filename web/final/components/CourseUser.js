import React from 'react';
import { useQuery } from '@apollo/client';

import FavoriteCourse from './FavoriteCourse';
import { GET_ME } from '../gql/query';

const CourseUser = props => {
  const { loading, error, data } = useQuery(GET_ME);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  console.log(props.note.course.id);

  return (
    <FavoriteCourse
      me={data.me}
      courseId={props.note.course.id}
      favoriteCount={props.note.course.favoriteCount}
    />
  );
};

export default CourseUser;
