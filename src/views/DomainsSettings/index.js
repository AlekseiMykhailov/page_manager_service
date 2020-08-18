import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import * as FETCH from 'src/utils/fetch';
import * as CONST from 'src/utils/const';
import { removeStatusMessage, setStatusMessage } from 'src/actions/messageActions';

import { makeStyles } from '@material-ui/styles';
import {
  Container,
  colors,
} from '@material-ui/core';
import Page from 'src/components/Page';
import Header from 'src/views/Header';
import FormDomainSettings from './FormDomainSettings';

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
}));

function DomainsSettings() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const API_URL = process.env.REACT_APP_API_URL;
  const { domainId } = useParams();
  const [currentDomain, setCurrentDomain] = useState();
  const [domainFieldsData, setDomainFieldsData] = useState({});
  const fields = Object.values(domainFieldsData);

  const handleResponse = (
    response,
    successAction,
    successMessage,
    errorMessage = 'Something went wrong...',
  ) => {
    if (response.ok) {
      dispatch(setStatusMessage(CONST.SUCCESS, successMessage));
      if (successAction) {
        successAction();
      }
    } else {
      dispatch(setStatusMessage(CONST.ERROR, errorMessage));
    }

    setTimeout(() => {
      dispatch(removeStatusMessage());
    }, CONST.TIME_VISIBILITY_MESSAGES);
  };

  const fetchData = useCallback(() => {
    let pagesList = [];
    let homePageId;

    FETCH.getData(`${API_URL}/domains`)
      .then((response) => {
        const domainData = response.domains.find((domain) => domain.id === +domainId);

        homePageId = domainData.homePageId;
        setCurrentDomain(domainData);
      })
      .then(() => FETCH.getData(`${API_URL}/pages`))
      .then((response) => { pagesList = response.pages; })
      .then(() => FETCH.getData(`${API_URL}/published`))
      .then((published) => {
        pagesList = pagesList.filter((page) => {
          const isPublished = published.pages.some((publishedPage) => (
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
        value: +value,
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
      .then((response) => handleResponse(response, fetchData, 'Domain settings was changed'));
  };

  return (
    <Page
      className={classes.root}
      title="Create New Page"
    >
      <Container maxWidth="lg">
        {currentDomain && (
          <Header
            name="Settings"
            title={`Domain: ${currentDomain.domain}`}
            subtitle={currentDomain.name}
            link={`http://${currentDomain.domain}`}
          />
        )}
        {(fields.length > 0) && (
          <FormDomainSettings
            className={classes.section}
            fields={fields}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
        )}
      </Container>
    </Page>
  );
}

export default DomainsSettings;
