import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Paper, Input } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
  },
  search: {
    flexGrow: 1,
    height: 52,
    padding: theme.spacing(0, 2),
    display: 'flex',
    alignItems: 'center'
  },
  searchIcon: {
    marginRight: theme.spacing(2),
    color: theme.palette.icon
  },
  searchInput: {
    flexGrow: 1
  },
  searchButton: {
    backgroundColor: theme.palette.common.white,
    marginLeft: theme.spacing(2)
  }
}));

function Search({ handleChange, className, ...rest }) {
  const classes = useStyles();

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Paper
        className={classes.search}
        elevation={1}
      >
        <SearchIcon className={classes.searchIcon} />
        <Input
          className={classes.searchInput}
          disableUnderline
          placeholder="Search"
          onChange={handleChange}
          variant="outlined"
          size="small"
        />
      </Paper>
    </div>
  );
}

Search.propTypes = {
  className: PropTypes.string,
  handleChange: PropTypes.func
};

export default Search;
