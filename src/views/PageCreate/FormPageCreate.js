import React, { useState, useEffect, useCallback } from 'react';
import { Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  TextField,
  Button,
} from '@material-ui/core';
import * as FETCH from 'src/utils/fetch';
import * as CONST from 'src/utils/const';
import { setStatusMessage, removeStatusMessage } from 'src/actions/messageActions';

const useStyles = makeStyles((theme) => ({
  root: {},
  policy: {
    display: 'flex',
    alignItems: 'center'
  },
  policyCheckbox: {
    marginLeft: '-14px'
  },
  submitButton: {
    marginTop: theme.spacing(2)
  }
}));

function FormPageCreate({ className, ...rest }) {
  const classes = useStyles();
  const [pageSchema, setPagesSchema] = useState(null);
  const [pageData, setPagesData] = useState(null);
  const [isCreated, setIsCreated] = useState(false);
  const dispatch = useDispatch();

  const API_URL = process.env.REACT_APP_API_URL;

  const getPageSchema = useCallback(() => {
    FETCH.getData(`${API_URL}/pages/schema`)
      .then((response) => {
        if (response.ok) {
          const newPageData = {};

          Object.values(response.schema).map(({ name }) => { 
            newPageData[name] = '';
            return name;
          });

          setPagesSchema(response.schema);
          setPagesData(newPageData);
        } else if (response.error) {
          console.log(response.error);
        }
      });
  }, [API_URL]);

  useEffect(() => {
    getPageSchema();
  }, [getPageSchema]);

  const handleStatusMessage = (status, text) => {
    dispatch(setStatusMessage(status, text));

    setTimeout(() => {
      dispatch(removeStatusMessage());
    }, CONST.TIME_VISIBILITY_MESSAGES);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    event.persist();
    setPagesData({
      ...pageData,
      [name]: value,
    });
  };

  const createWebPage = (e) => {
    e.preventDefault();

    console.log('Create', pageData.title, pageData.slug);

    if (!pageData.title || !pageData.slug) {
      return;
    }

    FETCH.postData(
      `${API_URL}/pages`,
      pageData,
    ).then((response) => {
      if (response.ok) {
        console.log(response);
        setIsCreated(true);
        handleStatusMessage(CONST.SUCCESS, 'New page was created');
      } else {
        console.log(`Error: ${response}`);
        handleStatusMessage(CONST.ERROR, 'Something went wrong...');
      }
    });
  };

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      {isCreated && <Redirect to={`/pages/${pageData.slug}`} />}
      <CardContent>
        {pageSchema && pageData && (
          <form autoComplete="off" onSubmit={createWebPage}>
            {Object.values(pageSchema).map(({ name, type }) => (
              <TextField
                fullWidth
                label={name}
                margin="normal"
                name={name}
                type={type}
                onChange={handleChange}
                value={pageData[name]}
                variant="outlined"
                key={name}
              />
            ))}
            <Button
              className={classes.submitButton}
              color="secondary"
              fullWidth
              size="large"
              type="submit"
              variant="contained"
            >
              Create Page
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

FormPageCreate.propTypes = {
  className: PropTypes.string
};

export default FormPageCreate;
