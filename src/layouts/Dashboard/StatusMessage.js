import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { getStatusMessage } from 'src/selectors';

const useStyles = makeStyles(() => ({
  root: {},
  statusMessage: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: '3rem',
    width: '100%',
    boxSizing: 'border-box',
    color: 'white',
    textAlign: 'right',
    lineHeight: '3rem',
    zIndex: 1,
  },
  error: {
    backgroundColor: 'red',
  },
  success: {
    backgroundColor: 'green',
  },
  message: {
    padding: '1rem 4rem',
    color: '#fff',
  }
}));

function StatusMessage() {
  const statusMessage = useSelector(getStatusMessage);
  const classes = useStyles();

  return (
    <>
      {statusMessage.text && (
      <div className={classes.statusMessage}>
        <div className={classes[statusMessage.status]}>
          <Typography
            className={classes.message}
            variant="h4"
          >
            {statusMessage.text}
          </Typography>

        </div>
      </div>
      )}
    </>
  );
}

export default StatusMessage;
