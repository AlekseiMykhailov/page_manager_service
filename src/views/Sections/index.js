import React, { useState, useEffect, useCallback } from 'react';
import * as FETCH from 'src/utils/fetch';

import { makeStyles } from '@material-ui/styles';
import Page from 'src/components/Page';
import {
  Container,
} from '@material-ui/core';
import PageHeader from 'src/components/PageHeader';
import SectionsList from 'src/views/Sections/SectionsList';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
}));

function Sections() {
  const classes = useStyles();
  const API_URL = process.env.REACT_APP_API_URL;
  const [sections, setSections] = useState();

  const fetchSections = useCallback(() => {
    FETCH.getData(`${API_URL}/schemas/sections`)
      .then((response) => {
        setSections(response.schemas);
      });
  }, [API_URL]);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  return (
    <Page
      className={classes.root}
      title="Pages"
    >
      <Container maxWidth="lg">
        {sections && (
          <PageHeader
            name="sections"
            title="Section Management"
            subtitle=""
          />
        )}
        {sections && sections.length > 0 && (
          <SectionsList
            className={classes.sections}
            sections={sections}
          />
        )}
        {sections && sections.length === 0 && ('Sections not created yet')}
      </Container>
    </Page>
  );
}

export default Sections;
