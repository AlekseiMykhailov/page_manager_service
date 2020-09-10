import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import * as FETCH from 'src/utils/fetch';
import { useStatusMessage } from 'src/hooks';

import { makeStyles } from '@material-ui/styles';
import {
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
  const [currentDomain, setCurrentDomain] = useState();
  const [domainAliases, setDomainAliases] = useState();
  const [domainFieldsData, setDomainFieldsData] = useState({});
  const fields = Object.values(domainFieldsData);

  const fetchData = useCallback(() => {
    let pagesList = [];
    let homePageId;
    let robotsTxt;

    FETCH.getData(`${API_URL}/domains/${domainId}`)
      .then((domainData) => {
        homePageId = domainData.settings.homePageId;
        robotsTxt = domainData.settings.robotsTxt;
        setCurrentDomain(domainData.settings);
        setDomainAliases(domainData.aliases);
      })
      .then(() => FETCH.getData(`${API_URL}/pages`))
      .then((response) => { pagesList = response.pages; })
      .then(() => FETCH.getData(`${API_URL}/publish`))
      .then((published) => {
        pagesList = pagesList.filter((page) => {
          const isPublished = published.some((publishedPage) => (
            publishedPage.webPageId === page.id
          ));

          return isPublished && (page.domainId === +domainId);
        });

        const domainFields = {
          homePageId: {
            name: 'homePageId',
            label: 'Change Home Page',
            type: 'select',
            value: homePageId,
            options: pagesList.map(({ id, title }) => ({
              value: id,
              title,
            }))
          },
          robotsTxt: {
            name: 'robotsTxt',
            label: 'File robots.txt',
            type: 'textarea',
            value: robotsTxt,
          },
        };

        setDomainFieldsData(domainFields);
      });
  }, [API_URL, domainId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setDomainFieldsData({
      ...domainFieldsData,
      [name]: {
        ...domainFieldsData[name],
        value,
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const domainSettings = {
      id: currentDomain.id,
    };

    Object.values(domainFieldsData).forEach(({ name, value }) => {
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
        {currentDomain && (
          <PageHeader
            name="Settings"
            title={`Domain: ${currentDomain.domain}`}
            subtitle={currentDomain.name}
            link={`http://${currentDomain.domain}`}
          />
        )}
        {(fields.length > 0) && (
          <FormDomainSettings
            fields={fields}
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
      </Container>
    </Page>
  );
}

export default DomainsSettings;
