import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
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

function SectionEdit() {
  const classes = useStyles();
  const API_URL = process.env.REACT_APP_API_URL;
  const { sectionSchemaId } = useParams();
  const [setStatusMessage] = useStatusMessage();
  const [sectionSchema, setSectionSchema] = useState([]);

  const fetchSectionSchema = useCallback(() => {
    FETCH.getData(`${API_URL}/schemas/sections/${sectionSchemaId}`)
      .then(({ schema }) => {
        setSectionSchema(schema.map((field) => {
          if (field.name === 'json') {
            return {
              ...field,
              value: JSON.stringify(field.value, null, 2),
            };
          }
          return field;
        }));
      });
  }, [API_URL, sectionSchemaId]);

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

    schema.id = +sectionSchemaId;
    schema.json = JSON.parse(schema.json);

    FETCH.putData(`${API_URL}/schemas/sections`, schema)
      .then((response) => setStatusMessage(response, fetchSectionSchema, 'Section`s Schema was changed'));
  };

  return (
    <Page
      className={classes.root}
      title="Section Edit"
    >
      <Container maxWidth="lg">
        {sectionSchema && (
          <PageHeader
            name="Sections"
            title="Edit Section Schema"
            subtitle={sectionSchema.name}
          />
        )}
        {(sectionSchema && sectionSchema.length > 0) && (
          <SectionForm
            schema={sectionSchema}
            actionType="edit"
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
        )}
      </Container>
    </Page>
  );
}

export default SectionEdit;
