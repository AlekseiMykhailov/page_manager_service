import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import * as FETCH from 'src/utils/fetch';
import { useStatusMessage } from 'src/hooks';

import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  Container,
  colors,
} from '@material-ui/core';
import Page from 'src/components/Page';
import PageHeader from 'src/components/PageHeader';
import FormDomainSettings from 'src/views/DomainsSettings/FormDomainSettings';
import DomainAliasesControl from './DomainAliasesControl';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  divider: {
    backgroundColor: colors.grey[300],
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3)
  },
  form: {
    width: '100%',
    boxSizing: 'border-box',
    marginRight: theme.spacing(5),
  },
  noPaddingLeft: {
    paddingLeft: 0,
  },
}));

function DomainsSettings() {
  const classes = useStyles();
  const API_URL = process.env.REACT_APP_API_URL;
  const { domainId } = useParams();
  const [setStatusMessage] = useStatusMessage();
  const [domainData, setDomainData] = useState();
  const [domainFields, setDomainFields] = useState();
  const [domainAliases, setDomainAliases] = useState();

  const fetchData = useCallback(() => {
    FETCH.getData(`${API_URL}/domains/${domainId}`)
      .then((res) => {
        if (res.ok) {
          setDomainData(res.domainData.data);
          setDomainFields(res.domainData.fields);
          setDomainAliases(res.domainData.aliases);
        }
      });
  }, [API_URL, domainId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setDomainFields(domainFields.map((field) => {
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
    const domainSettings = {
      id: domainId,
    };

    domainFields.forEach(({ name, value }) => {
      domainSettings[name] = value;
    });
    FETCH.putData(`${API_URL}/domains`, domainSettings,)
      .then((response) => setStatusMessage(response, fetchData, 'Domain settings was changed'));
  };

  const handleAddAlias = (domainAlias) => {
    const aliasData = {
      domainId: +domainId,
      domainAlias,
    };

    FETCH.postData(`${API_URL}/aliases`, { aliasData })
      .then((response) => {
        setStatusMessage(response, fetchData, 'Alias was added');

        if (response.ok) {
          fetchData();
        }
      });
  };

  const handleDeleteAlias = (e) => {
    const { aliasId } = e.currentTarget.dataset;

    FETCH.deleteData(`${API_URL}/aliases/${aliasId}`)
      .then((response) => {
        setStatusMessage(response, fetchData, 'Alias was deleted');

        if (response.ok) {
          fetchData();
        }
      });
  };

  return (
    <Page
      className={classes.root}
      title="Domain Settings"
    >
      <Container maxWidth="lg">
        {domainData && (
          <PageHeader
            name="Settings"
            title={`Domain: ${domainData.domain}`}
            subtitle={domainData.name}
            link={`http://${domainData.domain}`}
          />
        )}
        <Card>
          <CardContent>
            {domainFields && (
            <FormDomainSettings
              fields={domainFields}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
            />
            )}
            {domainAliases && (
            <DomainAliasesControl
              aliases={domainAliases}
              handleAddAlias={handleAddAlias}
              handleDeleteAlias={handleDeleteAlias}
            />
            )}
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
}

export default DomainsSettings;
