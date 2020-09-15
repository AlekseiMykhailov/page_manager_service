import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import { makeStyles } from '@material-ui/styles';
import {
  Grid,
  Typography,
  colors,
} from '@material-ui/core';
import Label from 'src/components/Label';

const useStyles = makeStyles((theme) => ({
  root: {},
  name: {
    marginBottom: theme.spacing(3),
  },
  published: {
    display: 'flex',
    alignItems: 'center',
  },
  label: {
    color: theme.palette.common.white,
  },
}));

function PageEditHeader({
  className, name, isHomePage, pageData
}) {
  const classes = useStyles();

  return (
    <Grid
      container
      direction="column"
      alignItems="flex-start"
      className={clsx(classes.root, className)}
    >
      <Grid item>
        <Typography variant="overline">
          {name}
        </Typography>
        <Typography gutterBottom variant="h1">
          {pageData.title}
        </Typography>

        <a
          href={isHomePage
            ? `http://${pageData.domain}`
            : `http://${pageData.domain}/${pageData.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className={classes.label}
        >
          <Typography variant="h6">
            {isHomePage
              ? `http://${pageData.domain}`
              : `http://${pageData.domain}/${pageData.slug}`}
          </Typography>
        </a>
      </Grid>
      <Grid item>
        {pageData && pageData.publishedAt && (
          <Grid container direction="column">
            <Grid item>
              <Typography variant="body2" className={classes.published}>
                <Label color={colors.green[600]}>
                  <a
                    href={isHomePage
                      ? `http://${pageData.domain}`
                      : `http://${pageData.domain}/${pageData.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classes.label}
                  >
                    {isHomePage ? 'Published as Home Page' : 'Published'}
                  </a>
                </Label>
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2">
                {`Published At: ${moment(pageData.publishedAt).format(' LLLL')}`}
              </Typography>
            </Grid>
            {pageData.publishedAt !== pageData.updatedAt && (
              <Grid item>
                <Typography variant="body2">
                  {`Updated At: ${moment(pageData.updatedAt).format(' LLLL')}`}
                </Typography>
              </Grid>
            )}
          </Grid>
        )}
        {!pageData.publishedAt && (
          <Grid item>
            <Typography variant="body2">
              {`Updated At: ${moment(pageData.updatedAt).format(' LLLL')}`}
            </Typography>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}

PageEditHeader.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  isHomePage: PropTypes.bool,
  pageData: PropTypes.object,
};

export default PageEditHeader;
