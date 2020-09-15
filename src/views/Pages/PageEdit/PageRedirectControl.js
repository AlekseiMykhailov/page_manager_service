import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
  Typography,
} from '@material-ui/core';
import { Delete, AddCircle } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {},
  divider: {
    height: '4px',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
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

function PageRedirectControl({
  className,
  redirectsData,
  handleAddRedirect,
  handleDeleteRedirect,

}) {
  const classes = useStyles();
  const API_URL = process.env.REACT_APP_API_URL;
  const [redirectSlug, setRedirectSlug] = useState('');

  const handleChange = (e) => {
    const { value } = e.target;
    const pattern = new RegExp('[^A-Za-z0-9-]', 'g');

    setRedirectSlug(value.replace(pattern, ''));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!redirectSlug) {
      return;
    }
    handleAddRedirect(redirectSlug);
    setRedirectSlug('');
  };

  return (
    <div className={clsx(classes.root, className)}>
      <Divider className={classes.divider} />
      <Typography
        gutterBottom
        variant="h4"
      >
        Page Redirects
      </Typography>
      <List dense aria-label="page redirects">
        {redirectsData.length > 0 && redirectsData.map((redirect) => (
          <ListItem key={redirect.id}>
            <ListItemText primary={redirect.slug} />
            <ListItemSecondaryAction onClick={handleDeleteRedirect} data-redirect-id={redirect.id}>
              <IconButton edge="end" aria-label="delete redirect">
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
        <ListItem key="form-add-line" className={classes.noPaddingLeft}>
          <form
            className={classes.form}
            id="add-redirect-form"
            action={`${API_URL}/redirects`}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <TextField
              fullWidth
              id="add-redirect-field"
              label="Redirect Slug"
              margin="normal"
              name="redirect-slug"
              type="text"
              variant="outlined"
              value={redirectSlug}
              onChange={handleChange}
            />
            <ListItemSecondaryAction onClick={handleSubmit}>
              <IconButton edge="end" aria-label="add redirect">
                <AddCircle />
              </IconButton>
            </ListItemSecondaryAction>
          </form>
        </ListItem>
      </List>

    </div>
  );
}

PageRedirectControl.propTypes = {
  className: PropTypes.string,
  redirectsData: PropTypes.array,
  handleAddRedirect: PropTypes.func,
  handleDeleteRedirect: PropTypes.func,
};

export default PageRedirectControl;
