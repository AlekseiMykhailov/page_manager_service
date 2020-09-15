import React, { useState, useEffect, useCallback } from 'react';
import { Redirect } from 'react-router-dom';
import * as FETCH from 'src/utils/fetch';
import { useStatusMessage } from 'src/hooks';
import { makeStyles } from '@material-ui/styles';
import Page from 'src/components/Page';
import { Container } from '@material-ui/core';
import PageHeader from 'src/components/PageHeader';
import SectionForm from 'src/views/Sections/SectionForm';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
}));

function SectionCreate() {
  const classes = useStyles();
  const API_URL = process.env.REACT_APP_API_URL;
  const [setStatusMessage] = useStatusMessage();
  const [sectionSchema, setSectionSchema] = useState([]);
  const [redirectData, setRedirectData] = useState(false);

  const fetchSectionSchema = useCallback(() => {
    FETCH.getData(`${API_URL}/schemas/sections/create`)
      .then(({ schema }) => {
        setSectionSchema(schema);
      });
  }, [API_URL]);

  useEffect(() => {
    fetchSectionSchema();
  }, [fetchSectionSchema]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSectionSchema(sectionSchema.map((field) => {
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
    const schema = sectionSchema.reduce((acc, field) => ({
      ...acc,
      [field.name]: field.value,
    }), {});

    schema.json = JSON.parse(schema.json);

    FETCH.postData(`${API_URL}/schemas/sections`, schema)
      .then((response) => {
        if (response.ok) {
          setRedirectData(true);
        }
        setStatusMessage(response, fetchSectionSchema, 'Section`s Schema was created')
      });
  };

  return (
    <Page
      className={classes.root}
      title="Section Create"
    >
      {redirectData && (
        <Redirect to="/sections" />
      )}
      <Container maxWidth="lg">
        {sectionSchema && (
          <PageHeader
            name="Sections"
            title="Create Section Schema"
          />
        )}
        {(sectionSchema && sectionSchema.length > 0) && (
        <SectionForm
          schema={sectionSchema}
          actionType="create"
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
        )}
      </Container>
    </Page>
  );
}

export default SectionCreate;
