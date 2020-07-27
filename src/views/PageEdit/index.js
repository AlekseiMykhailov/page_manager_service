import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Page from 'src/components/Page';
import {
  Button,
  Container,
  Divider,
  Grid,
  Typography,
  colors,
} from '@material-ui/core';
import PublishIcon from '@material-ui/icons/Publish';
import Sections from './Sections';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  divider: {
    backgroundColor: colors.grey[300],
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3)
  },
  publishButton: {
    marginLeft: theme.spacing(2),
    paddingRight: theme.spacing(3),
    paddingLeft: theme.spacing(3),
    color: theme.palette.common.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
  },
  publishIcon: {
    marginRight: theme.spacing(1)
  },
}));

function PageCreate() {
  const classes = useStyles();

  const handlePublish = () => {};

  return (
    <Page
      className={classes.root}
      title="Edit Page"
    >
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid item>
            <Typography variant="overline">Pages</Typography>
            <Typography
              gutterBottom
              variant="h3"
            >
              Edit Page
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              className={classes.publishButton}
              onClick={handlePublish}
            >
              <PublishIcon className={classes.publishIcon} />
              Publish Page
            </Button>
          </Grid>
        </Grid>

        <Divider className={classes.divider} />
        <Sections />
      </Container>
    </Page>
  );
}

export default PageCreate;
