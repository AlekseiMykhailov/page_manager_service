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
  item: {
    '&:hover': {
      backgroundColor: theme.palette.common.white,
    },
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

function DomainAliasesControl({
  className,
  aliases,
  handleAddAlias,
  handleDeleteAlias,

}) {
  const classes = useStyles();
  const API_URL = process.env.REACT_APP_API_URL;
  const [domainAlias, setDomainAlias] = useState('');

  const handleChange = (e) => {
    const { value } = e.target;
    const pattern = new RegExp('[^A-Za-z0-9-_.]', 'g');

    setDomainAlias(value.replace(pattern, ''));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!domainAlias) {
      return;
    }
    handleAddAlias(domainAlias);
    setDomainAlias('');
  };

  return (
    <div className={clsx(classes.root, className)}>
      <Divider className={classes.divider} />
      <Typography
        gutterBottom
        variant="h4"
      >
        Domain Aliases
      </Typography>
      <List aria-label="domain aliases" className={classes.list}>
        {aliases.length > 0 && aliases.map((alias) => (
          <ListItem key={alias.id} className={classes.item}>
            <ListItemText primary={alias.domainAlias} />
            <ListItemSecondaryAction onClick={handleDeleteAlias} data-alias-id={alias.id}>
              <IconButton edge="end" aria-label="delete alias">
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
        <ListItem key="form-add-line" className={classes.noPaddingLeft}>
          <form
            className={classes.form}
            id="add-alias-form"
            action={`${API_URL}/aliases`}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <TextField
              fullWidth
              id="add-domain-alias"
              label="Domain Alias"
              margin="normal"
              name="domain-alias"
              type="text"
              variant="outlined"
              value={domainAlias}
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

DomainAliasesControl.propTypes = {
  className: PropTypes.string,
  aliases: PropTypes.array,
  handleAddAlias: PropTypes.func,
  handleDeleteAlias: PropTypes.func,
};

export default DomainAliasesControl;
