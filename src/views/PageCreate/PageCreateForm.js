import React, { useState, useEffect, useCallback } from 'react';
import { Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  Checkbox,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  TextField,
  Button,
} from '@material-ui/core';
import * as FETCH from 'src/utils/fetch';
import * as CONST from 'src/utils/const';
import { setStatusMessage, removeStatusMessage } from 'src/actions/messageActions';

const useStyles = makeStyles((theme) => ({
  root: {},
  submitButton: {
    marginTop: theme.spacing(2)
  },
}));

function FormPageCreate({ className, ...rest }) {
  const classes = useStyles();
  const [pageSchema, setPagesSchema] = useState(null);
  const [domains, setDomains] = useState([]);
  const [pageData, setPagesData] = useState(null);
  const [isCreated, setIsCreated] = useState(false);
  const dispatch = useDispatch();

  const API_URL = process.env.REACT_APP_API_URL;

  const getPageSchema = useCallback(() => {
    FETCH.getData(`${API_URL}/pages/schema`)
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

  const handleChange = (event) => {
    const { name, value, type } = event.target;

    if (type === 'checkbox') {
      setPagesData({ ...pageData, [name]: !pageData[name] });
    } else {
      setPagesData({ ...pageData, [name]: value });
    }
  };

  const createWebPage = (e) => {
    e.preventDefault();

    if (!pageData.title || !pageData.slug) {
      return;
    }

    FETCH.postData(
      `${API_URL}/pages`,
      pageData,
    ).then((response) => {
      handleResponse(response, setIsCreated(true), 'New page was created');
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
            {Object.values(pageSchema)
              .sort((a, b) => a.order - b.order)
              .map(({ name, label, type }) => {
                if (type === 'checkbox') {
                  return (
                    <InputLabel htmlFor={name} key={name}>
                      <Checkbox
                        id={name}
                        label={label}
                        margin="normal"
                        name={name}
                        variant="outlined"
                        checked={pageData[name]}
                        onChange={handleChange}
                      />
                      Set as home page
                    </InputLabel>
                  );
                }

                if (type === 'select') {
                  return (
                    <FormControl
                      variant="outlined"
                      className={classes.formControl}
                      fullWidth
                      key={name}
                    >
                      <InputLabel id={`${name}-label`}>
                        {label}
                      </InputLabel>
                      <Select
                        fullWidth
                        id={name}
                        label={label}
                        name={name}
                        value={pageData[name]}
                        variant="outlined"
                        onChange={handleChange}
                      >

                        {domains.map((domain) => (
                          <MenuItem value={domain.name} key={domain.name}>
                            {domain.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  );
                }

                return (
                  <TextField
                    fullWidth
                    label={label}
                    margin="normal"
                    name={name}
                    type={type}
                    onChange={handleChange}
                    value={pageData[name]}
                    variant="outlined"
                    key={name}
                  />
                );
              })}
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
