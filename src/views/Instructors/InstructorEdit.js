import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
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

function InstructorEdit() {
  const classes = useStyles();
  const API_URL = process.env.REACT_APP_API_URL;
  const { instructorId } = useParams();
  const [setStatusMessage] = useStatusMessage();
  const [instructorSchema, setInstructorSchema] = useState([]);

  const fetchInstructors = useCallback(() => {
    FETCH.getData(`${API_URL}/instructors/${instructorId}`)
      .then(({ instructorFields }) => {
        setInstructorSchema(instructorFields);
      });
  }, [API_URL, instructorId]);

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

    FETCH.putData(`${API_URL}/instructors/${instructorId}`, instructor)
      .then((response) => setStatusMessage(response, fetchInstructors, 'Instructor`s data was changed'));
  };

  return (
    <Page
      className={classes.root}
      title="Instructors"
    >
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
            actionType="edit"
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
        )}
      </Container>
    </Page>
  );
}

export default InstructorEdit;
