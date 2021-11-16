import React, { useState } from 'react';
import { useMutation } from '@apollo/client';

import ButtonAsLink from './ButtonAsLink';
import { TOGGLE_FAVORITE_COURSE } from '../gql/mutation';
import { GET_MY_FAVORITES } from '../gql/query';

const FavoriteCourse = props => {
  const [count, setCount] = useState(props.favoriteCount);
  const [favorited, setFavorited] = useState(
    props.me.courses.filter(course => course.id === props.courseId).length > 0
  );

  const [toggleFavoriteCourse] = useMutation(TOGGLE_FAVORITE_COURSE, {
    variables: {
      id: props.courseId
    },
    refetchQueries: [{ query: GET_MY_FAVORITES }]
  });

  return (
    <React.Fragment>
      {favorited ? (
        <div style={{ display: 'inline-block' }}>
          &nbsp;&nbsp;
          <ButtonAsLink
            style={{
              border: '0px',
              paddingLeft: '4px',
              borderRadius: '5px'
            }}
            onClick={() => {
              toggleFavoriteCourse();
              setFavorited(false);
              setCount(count - 1);
            }}
          >
            <div style={{ color: 'red' }}>♡&nbsp;</div>
          </ButtonAsLink>
        </div>
      ) : (
        <div style={{ display: 'inline-block' }}>
          &nbsp;&nbsp;
          <ButtonAsLink
            style={{
              border: '0px',
              paddingLeft: '4px',
              borderRadius: '5px'
            }}
            onClick={() => {
              toggleFavoriteCourse();
              setFavorited(true);
              setCount(count + 1);
            }}
          >
            ♡&nbsp;
          </ButtonAsLink>
        </div>
      )}
      {count}
    </React.Fragment>
  );
};

export default FavoriteCourse;
