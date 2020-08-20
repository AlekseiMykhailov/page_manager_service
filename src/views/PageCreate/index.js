import React, { useState, useEffect, useCallback } from 'react';
import { Redirect } from 'react-router-dom';
import { useStatusMessage } from 'src/hooks';
import { makeStyles } from '@material-ui/styles';
import Page from 'src/components/Page';
import {
  Container,
} from '@material-ui/core';
import PageHeader from 'src/components/PageHeader';
import * as FETCH from 'src/utils/fetch';
import FormPageCreate from '../../components/WebPage/PageCreateForm';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  section: {
    '& + &': {
      marginTop: theme.spacing(5)
    }
  }
}));

function PageCreate() {
  const classes = useStyles();
  const [pageSchema, setPagesSchema] = useState(null);
  const [domains, setDomains] = useState([]);
  const [pageData, setPagesData] = useState(null);
  const [isCreated, setIsCreated] = useState(false);
  const selectedDomain = domains.find((domain) => domain.domain === pageData.domain);
  const [setStatusMessage] = useStatusMessage();

  const API_URL = process.env.REACT_APP_API_URL;

  const getPageSchema = useCallback(() => {
    FETCH.getData(`${API_URL}/schemas/pages`)
      .then((response) => {
        if (response.ok) {
          const newPageData = {};

          Object.values(response.schema).map(({ name, type }) => {
            newPageData[name] = (type === 'checkbox') ? false : '';

            return name;
          });

          setPagesSchema(response.schema);
          setPagesData(newPageData);
        }
      });
  }, [API_URL]);

  const getDomains = useCallback(() => {
    FETCH.getData(`${API_URL}/domains`)
      .then((response) => {
        if (response.ok) {
          setDomains(response.domains);
        }
      });
  }, [API_URL]);

  useEffect(() => {
    getPageSchema();
  }, [getPageSchema]);

  useEffect(() => {
    getDomains();
  }, [getDomains]);

  const handleChange = (event) => {
    const { name, value, type } = event.target;

    if (type === 'checkbox') {
      setPagesData({ ...pageData, [name]: !pageData[name] });
    } else {
      setPagesData({ ...pageData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!pageData.title || !pageData.slug) {
      return;
    }

    const currentDomain = domains.find((domain) => domain.domain === pageData.domain);

    FETCH.postData(
      `${API_URL}/pages`,
      {
        ...pageData,
        domainId: currentDomain.id,
      },
    ).then((response) => {
      if (response.ok) {
        setIsCreated(true);
        setPagesData({
          ...pageData,
          id: response.id,
        });
      }
      setStatusMessage(response, null, 'New page was created', response.error);
    });
  };

  return (
    <Page
      className={classes.root}
      title="Create New Page"
    >
      {isCreated && pageData.id && (
        <Redirect to={`/pages/${selectedDomain.id}/${pageData.id}`} />
      )}
      <Container maxWidth="lg">
        <PageHeader
          name="pages"
          title="Create New Page"
        />
        <FormPageCreate
          className={classes.section}
          pageSchema={pageSchema}
          pageData={pageData}
          domains={domains}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </Container>
    </Page>
  );
}

export default PageCreate;
