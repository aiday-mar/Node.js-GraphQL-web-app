import React, { useState } from 'react';
import styled from 'styled-components';
import Button from './Button';

const Wrapper = styled.div`
  height: 100%;
`;

const Form = styled.form`
  height: 100%;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 90%;
`;

const NoteForm = props => {
  const [value, setValue] = useState({
    content: props.content,
    course: props.course || ''
  });

  // The onChange methods store correctly the input values
  const onChangeCourse = event => {
    let newValue = value;
    newValue.course = event.target.value;
    setValue(newValue);
    //console.log(value);
  };

  const onChangeContent = event => {
    let newValue = value;
    newValue.content = event.target.value;
    setValue(newValue);
  };

  return (
    <Wrapper>
      <Form
        onSubmit={e => {
          e.preventDefault();
          console.log(value);
          props.action({
            variables: {
              ...value
            }
          });
        }}
      >
        <TextArea
          required
          type="text"
          name="course"
          placeholder="Course Name"
          onChange={onChangeCourse}
          style={{ height: 40, padding: 10 }}
        />
        <TextArea
          required
          type="text"
          name="content"
          placeholder="Lecture Content"
          onChange={onChangeContent}
          style={{ padding: 10 }}
        />
        <Button type="submit">Save</Button>
      </Form>
    </Wrapper>
  );
};

export default NoteForm;
