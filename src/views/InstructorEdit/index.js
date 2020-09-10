import React, {
  useState, useEffect, useCallback
} from 'react';
import { useParams } from 'react-router-dom';
import * as FETCH from 'src/utils/fetch';
import { useStatusMessage } from 'src/hooks';

import { makeStyles } from '@material-ui/styles';
import Page from 'src/components/Page';
import {
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  TextField,
} from '@material-ui/core';
import { SaveAlt } from '@material-ui/icons';
import PageHeader from 'src/components/PageHeader';

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
  const [instructorData, setInstructorData] = useState([]);

  const fetchInstructors = useCallback(() => {
    FETCH.getData(`${API_URL}/instructors/${instructorId}`)
      .then(({ instructorFields }) => {
        setInstructorData(instructorFields);
      });
  }, [API_URL, instructorId]);

  useEffect(() => {
    fetchInstructors();
  }, [fetchInstructors]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setInstructorData(instructorData.map((field) => {
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
    const instructor = instructorData.reduce((acc, field) => ({
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
        {(instructorData.length > 0) && (
          <PageHeader
            name="Instructor"
            title="Edit Instructor"
          />
        )}
        <Card>
          <CardContent>
            {(instructorData.length > 0) && (
              <form
                id={instructorId}
                action={`${API_URL}/instructors/${instructorId}`}
                noValidate
                autoComplete="off"
                className={classes.form}
                onSubmit={handleSubmit}
              >
                {instructorData.map(({
                  name, type, description, value
                }) => (
                  <TextField
                    fullWidth
                    label={description}
                    margin="normal"
                    name={name}
                    type={type}
                    variant="outlined"
                    value={value}
                    onChange={handleChange}
                    key={name}
                  />
                ))}
                <Grid
                  container
                  direction="row"
                  justify="flex-end"
                  alignItems="center"
                >
                  <Grid item>
                    <Button
                      type="submit"
                      size="large"
                      variant="contained"
                      color="primary"
                      startIcon={<SaveAlt />}
                    >
                      Save Instructor
                    </Button>
                  </Grid>
                </Grid>
              </form>
            )}
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
}

export default InstructorEdit;
