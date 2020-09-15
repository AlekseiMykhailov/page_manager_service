import React, { useState, useEffect, useCallback } from 'react';
import { Redirect } from 'react-router-dom';
import * as FETCH from 'src/utils/fetch';
import { useStatusMessage } from 'src/hooks';

import { makeStyles } from '@material-ui/styles';
import Page from 'src/components/Page';
import { Container } from '@material-ui/core';
import PageHeader from 'src/components/PageHeader';
import InstructorForm from 'src/views/Instructors/InstructorForm';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
}));

function InstructorCreate() {
  const classes = useStyles();
  const API_URL = process.env.REACT_APP_API_URL;
  const [setStatusMessage] = useStatusMessage();
  const [instructorSchema, setInstructorSchema] = useState([]);
  const [redirectData, setRedirectData] = useState();

  const fetchInstructors = useCallback(() => {
    FETCH.getData(`${API_URL}/schemas/instructor`)
      .then(({ schema }) => {
        setInstructorSchema(schema);
      });
  }, [API_URL]);

  useEffect(() => {
    fetchInstructors();
  }, [fetchInstructors]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setInstructorSchema(instructorSchema.map((field) => {
      if (field.name === name) {
        return {
          ...field,
          value,
        };
      }

      return field;
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const instructor = instructorSchema.reduce((acc, field) => ({
      ...acc,
      [field.name]: field.value,
    }), {});

    FETCH.postData(`${API_URL}/instructors`, instructor)
      .then((response) => {
        if (response.ok) {
          setRedirectData({
            instructorId: response.id,
          });
        }
        setStatusMessage(response, null, 'Instructor`s was created');
      });
  };

  return (
    <Page
      className={classes.root}
      title="Instructors"
    >
      {redirectData && (
        <Redirect to={`/instructors/${redirectData.instructorId}`} />
      )}
      <Container maxWidth="lg">
        {(instructorSchema.length > 0) && (
          <PageHeader
            name="Instructor"
            title="Edit Instructor"
          />
        )}
        {(instructorSchema && instructorSchema.length > 0) && (
          <InstructorForm
            schema={instructorSchema}
            actionType="create"
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
        )}
      </Container>
    </Page>
  );
}

export default InstructorCreate;
