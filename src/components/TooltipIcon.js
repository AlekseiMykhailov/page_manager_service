import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
  Link,
  Tooltip,
  colors,
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    minWidth: 'auto',
    padding: 0,
    color: colors.grey[900],

    '&:hover': {
      color: colors.blue[900],
    }
  },
  disabled: {
    color: colors.grey[300],
    '&:hover': {
      color: colors.blue[300],
    }
  },
}));

function TooltipIcon({
  className,
  icon,
  type,
  link,
  title,
  disabled,
  handleClick,
  ...rest
}) {
  const classes = useStyles();

  if (type === 'icon') {
    return (
      <Tooltip
        title={title}
        className={clsx(classes.root, className)}
      >
        {icon}
      </Tooltip>
    );
  }

  if (type === 'internal' || !type) {
    return (
      <Tooltip
        title={title}
        className={clsx(classes.root, className)}
      >
        <Link
          component={RouterLink}
          to={link}
          underline="none"
          className={classes.button}
        >
          {icon}
        </Link>
      </Tooltip>
    );
  }

  if (type === 'external') {
    return (
      <Tooltip
        title={title}
        className={clsx(classes.root, className)}
      >
        {disabled ? (
          <span className={clsx(classes.button, classes.disabled)}>
            {icon}
          </span>
        ) : (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={classes.button}
          >
            {icon}
          </a>
        )}
      </Tooltip>
    );
  }

  if (type === 'button') {
    return (
      <Tooltip
        title={title}
        className={clsx(classes.root, className)}
      >
        <span>
          <Button
            className={classes.button}
            onClick={handleClick}
            disabled={disabled}
            {...rest}
          >
            {icon}
          </Button>
        </span>
      </Tooltip>
    );
  }
}

TooltipIcon.propTypes = {
  type: PropTypes.oneOf(['icon', 'internal', 'external', 'button']).isRequired,
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  link: PropTypes.string,
  disabled: PropTypes.bool,
  handleClick: PropTypes.func,
  className: PropTypes.string,
};

export default TooltipIcon;
