import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ME } from '../gql/query';
import FavoriteCourse from './FavoriteCourse';

const CourseComponent = ({ courses }) => {
  const { loading, error, data } = useQuery(GET_ME);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  return (
    <div className="note-feed">
      {courses.map(course => (
        <div key={course.id}>
          <FavoriteCourse
            me={data.me}
            courseId={course.id}
            courseName={course.name}
            favoriteCount={course.favoriteCount}
          />
        </div>
      ))}
    </div>
  );
};

export default CourseComponent;
