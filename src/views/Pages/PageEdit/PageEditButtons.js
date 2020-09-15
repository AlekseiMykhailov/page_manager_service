import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Grid,
  Button,
  ButtonGroup,
  colors,
} from '@material-ui/core';
import {
  Archive, Delete, Visibility, Publish
} from '@material-ui/icons';
import PageClone from './PageCloneControl';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
  },
  buttons: {},
  button: {
    paddingRight: theme.spacing(3),
    paddingLeft: theme.spacing(3),
    color: theme.palette.common.white,
  },
  deleteButton: {
    color: colors.red[600],
    borderColor: colors.red[600],
    '&:hover': {
      color: theme.palette.common.white,
      backgroundColor: colors.red[600]
    }
  },
  publishButton: {
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900],
    }
  },
  unPublishButton: {
    backgroundColor: colors.yellow[600],
    '&:hover': {
      backgroundColor: colors.yellow[900],
    }
  },
}));

function PageHeader({
  className,
  pageId,
  isPublished,
  handleDelete,
  handlePublish,
  handleUnPublish,
}) {
  const classes = useStyles();
  const API_URL = process.env.REACT_APP_API_URL;

  return (
    <Grid
      container
      direction="row"
      justify="space-between"
      alignItems="center"
      className={clsx(classes.root, className)}
    >
      <Grid item>
        <PageClone />
      </Grid>
      <Grid item>
        <ButtonGroup
          variant="contained"
          size="small"
          aria-label="large outlined button group"
          className={classes.buttons}
        >
          <Button
            variant="outlined"
            disabled={isPublished}
            className={clsx(classes.button, classes.deleteButton)}
            onClick={handleDelete}
            startIcon={<Archive />}
          >
            Archive
          </Button>
          <Button
            variant="contained"
            className={clsx(classes.button, classes.previewButton)}
            color="primary"
            href={`${API_URL}/preview/${pageId}`}
            target="_blank"
            startIcon={<Visibility />}
          >
            Preview
          </Button>
          <Button
            variant="contained"
            disabled={!isPublished}
            className={clsx(classes.button, classes.unPublishButton)}
            onClick={handleUnPublish}
            startIcon={<Delete />}
          >
            UnPublish
          </Button>
          <Button
            variant="contained"
            className={clsx(classes.button, classes.publishButton)}
            onClick={handlePublish}
            startIcon={<Publish />}
          >
            {isPublished ? 'Publish Update' : 'Publish'}
          </Button>
        </ButtonGroup>
      </Grid>
    </Grid>
  );
}

PageHeader.propTypes = {
  className: PropTypes.string,
  pageId: PropTypes.number,
  isPublished: PropTypes.bool,
  handleDelete: PropTypes.func,
  handlePublish: PropTypes.func,
  handleUnPublish: PropTypes.func,
};

export default PageHeader;
