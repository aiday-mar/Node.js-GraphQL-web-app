import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const CourseWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  margin-bottom: 2em;
  padding-bottom: 2em;
  border-bottom: 1px solid #f5f4f0;
`;

import Note from './Note';

// The $ allows us to set variables
const CourseComponent = ({ courses }) => {
  return (
    <div className="note-feed">
      {courses.map(courseName => (
        <CourseWrapper>
          <Link to={`note/${courseName}`}>{courseName}</Link>
        </CourseWrapper>
      ))}
    </div>
  );
};

export default CourseComponent;
