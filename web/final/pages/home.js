import React from 'react';
import { useQuery } from '@apollo/client';

import NoteFeed from '../components/NoteFeed';
import Button from '../components/Button';
import { GET_NOTES } from '../gql/query';

const Home = () => {
  // query hook
  const { data, loading, error, fetchMore } = useQuery(GET_NOTES);
  // if the data is loading, display a loading message
  if (loading) return <p>Loading...</p>;
  // if there is an error fetching the data, display an error message
  if (error) return <p>Error!</p>;

  // if the data is successful, display the data in our UI
  // remember than React.Fragment can be used instead of a div 
  return (
    <React.Fragment>
      <NoteFeed notes={data.noteFeed.notes} />

      // Suppose that you can still display more data, then you can display a button which will read "Load more"
      // When the button is clicked it will call the fetchMore method with the current cursor of the noteFee
      // You can take the previous and the current result and merge them 
      {data.noteFeed.hasNextPage && (
        <Button
          onClick={() =>
            fetchMore({
              variables: {
                cursor: data.noteFeed.cursor
              },
              updateQuery: (previousResult, { fetchMoreResult }) => {
                return {
                  noteFeed: {
                    cursor: fetchMoreResult.noteFeed.cursor,
                    hasNextPage: fetchMoreResult.noteFeed.hasNextPage,
                    // combine the new results and the old
                    notes: [
                      ...previousResult.noteFeed.notes,
                      ...fetchMoreResult.noteFeed.notes
                    ],
                    __typename: 'noteFeed'
                  }
                };
              }
            })
          }
        >
          Load more
        </Button>
      )}
    </React.Fragment>
  );
};

export default Home;
