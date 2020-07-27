import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Page from 'src/components/Page';
import {
  Container,
  Divider,
  Typography,
  colors,
} from '@material-ui/core';
import FormPageCreate from './FormPageCreate';

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
  section: {
    '& + &': {
      marginTop: theme.spacing(5)
    }
  }
}));

function PageCreate() {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="Create New Page"
    >
      <Container maxWidth="lg">
        <Typography variant="overline">Pages</Typography>
        <Typography
          gutterBottom
          variant="h3"
        >
          Create New Page
        </Typography>
        <Divider className={classes.divider} />
        <div className={classes.section}>
          <FormPageCreate />
        </div>
      </Container>
    </Page>
  );
}

export default PageCreate;
