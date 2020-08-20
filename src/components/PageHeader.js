import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Box,
  Divider,
  Typography,
} from '@material-ui/core';
import LinkIcon from '@material-ui/icons/Link';

const useStyles = makeStyles((theme) => ({
  root: {},
  name: {
    marginBottom: theme.spacing(3),
  },
  divider: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
}));

function PageHeader({
  children, className, name, title, subtitle, link
}) {
  const classes = useStyles();

  return (
    <Box component="div" className={clsx(classes.root, className)}>
      <Box component="div" className={classes.name}>
        <Typography variant="overline" className={classes.name}>
          {name}
        </Typography>
      </Box>
      <Typography variant="h1">
        {title}
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkIcon />
          </a>
        )}
      </Typography>
      {subtitle && (
        <Typography variant="h6">
          {subtitle}
        </Typography>
      )}
      {children}
      <Divider className={classes.divider} />
    </Box>
  );
}

PageHeader.propTypes = {
  children: PropTypes.element,
  className: PropTypes.string,
  name: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  link: PropTypes.string,
};

export default PageHeader;
