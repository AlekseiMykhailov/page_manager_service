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
import FormPageCreate from '../../components/Forms/FormPageCreate';

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
  const [pageFields, setPageFields] = useState(null);
  const [domains, setDomains] = useState([]);
  const [redirectData, setRedirectData] = useState();
  const [isAllowCreate, setIsAllowCreate] = useState(false);
  const [setStatusMessage] = useStatusMessage();

  const API_URL = process.env.REACT_APP_API_URL;

  const getPageSchema = useCallback(() => {
    FETCH.getData(`${API_URL}/schemas/page`)
      .then((response) => {
        if (response.ok) {
          setPageFields(response.schema);
          setDomains(response.domains);
        }
      });
  }, [API_URL]);

  useEffect(() => {
    getPageSchema();
  }, [getPageSchema]);

  useEffect(() => {
    if (!pageFields) {
      return;
    }

    const hasTitle = pageFields.find((field) => field.name === 'title').value;
    const hasDomain = pageFields.find((field) => field.name === 'domain').value;
    const hasSlug = pageFields.find((field) => field.name === 'slug').value;

    setIsAllowCreate(!!hasTitle && !!hasDomain && !!hasSlug);
  }, [pageFields]);

  const handleChange = (event) => {
    const { name, value, type } = event.target;

    setPageFields([
      ...pageFields.map((field) => {
        if (field.name === name) {
          return {
            ...field,
            value: (type === 'checkbox') ? !field.value : value,
          };
        }
        return field;
      })
    ]);

    setIsAllowCreate(Boolean());
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isAllowCreate) {
      return;
    }

    FETCH.postData(`${API_URL}/pages`, { fields: pageFields })
      .then((response) => {
        if (response.ok) {
          setRedirectData({
            domainId: response.domainId,
            webPageId: response.webPageId,
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
      {redirectData && (
        <Redirect to={`/pages/${redirectData.domainId}/${redirectData.webPageId}`} />
      )}
      <Container maxWidth="lg">
        <PageHeader
          name="pages"
          title="Create New Page"
        />
        <FormPageCreate
          className={classes.section}
          pageFields={pageFields}
          domains={domains}
          isAllowCreate={isAllowCreate}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </Container>
    </Page>
  );
}

export default PageCreate;
