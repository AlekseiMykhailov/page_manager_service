import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Page from 'src/components/Page';
import {
  Container,
  Divider,
  Typography,
  colors,
} from '@material-ui/core';
import PageList from './PageList';

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
}));

function Pages() {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="Pages"
    >
      <Container maxWidth="lg">
        <Typography variant="overline">Pages</Typography>
        <Typography
          gutterBottom
          variant="h3"
        >
          Pages List
        </Typography>
        <Divider className={classes.divider} />
        <PageList className={classes.pages} />
      </Container>
    </Page>
  );
}

export default Pages;
