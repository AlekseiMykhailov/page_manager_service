import React, {
  useState, useEffect, useCallback
} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import * as FETCH from 'src/utils/fetch';
import { useStatusMessage } from 'src/hooks';

import { makeStyles } from '@material-ui/styles';
import Page from 'src/components/Page';
import {
  Avatar,
  Card,
  CardContent,
  Container,
  Grid,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  colors,
} from '@material-ui/core';
import {
  LinkedIn, Facebook, Email, Delete, Edit
} from '@material-ui/icons';
import getInitials from 'src/utils/getInitials';
import PageHeader from 'src/components/PageHeader';
import TooltipIcon from 'src/components/TooltipIcon';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  cardContent: {
    padding: 0,
  },
  row: {
    transition: 'background-color 0.3s',
    '&:hover': {
      backgroundColor: colors.blue[100],
    }
  },
  link: {
    display: 'block',
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
}));

function Instructors() {
  const classes = useStyles();
  const API_URL = process.env.REACT_APP_API_URL;
  const [setStatusMessage] = useStatusMessage();
  const [instructors, setInstructors] = useState([]);

  const fetchInstructors = useCallback(() => {
    FETCH.getData(`${API_URL}/instructors`)
      .then((response) => {
        setInstructors(response.instructors);
      });
  }, [API_URL]);

  useEffect(() => {
    fetchInstructors();
  }, [fetchInstructors]);

  const deleteInstructor = (e) => {
    const { instructorId } = e.currentTarget.dataset;

    FETCH.deleteData(`${API_URL}/instructors/${instructorId}`)
      .then((res) => {
        setStatusMessage(res, null, 'Instructor was deleted');
        if (res.ok) {
          fetchInstructors();
        }
      });
  };

  return (
    <Page
      className={classes.root}
      title="Instructors"
    >
      <Container maxWidth="lg">
        {(instructors.length > 0) && (
          <PageHeader
            name="Instructors"
            title="Management of instructors"
          />
        )}
        <Card>
          <CardContent className={classes.cardContent}>
            {(instructors.length > 0) > 0 && (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Photo</TableCell>
                  <TableCell>Instructor</TableCell>
                  <TableCell align="center">Links</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {instructors.map((instructor) => (
                  <TableRow className={classes.row} key={instructor.id}>
                    <TableCell>
                      <Link
                        component={RouterLink}
                        to={`/instructors/${instructor.id}`}
                        color="textPrimary"
                        underline="none"
                      >
                        <Avatar
                          className={classes.photo}
                          src={instructor.photo}
                        >
                          {getInitials(instructor.name)}
                        </Avatar>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link
                        component={RouterLink}
                        to={`/instructors/${instructor.id}`}
                        color="textPrimary"
                        underline="none"
                        className={classes.link}
                      >
                        <Typography variant="h5">
                          {instructor.name}
                        </Typography>
                        <Typography variant="body1">
                          {instructor.about}
                        </Typography>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Grid
                        container
                        direction="row"
                        justify="center"
                        wrap="nowrap"
                        spacing={2}
                      >
                        <Grid item>
                          <TooltipIcon
                            type="external"
                            title="LinkedIn"
                            link={instructor.linkedIn}
                            disabled={!instructor.linkedIn}
                            icon={<LinkedIn />}
                          />
                        </Grid>
                        <Grid item>
                          <TooltipIcon
                            type="external"
                            title="Facebook"
                            link={instructor.facebook}
                            disabled={!instructor.facebook}
                            icon={<Facebook />}
                          />
                        </Grid>
                        <Grid item>
                          <TooltipIcon
                            type="external"
                            title="Email"
                            link={`mailto:${instructor.email}`}
                            disabled={!instructor.email}
                            icon={<Email />}
                          />
                        </Grid>
                      </Grid>

                    </TableCell>
                    <TableCell className={classes.actions}>
                      <Grid
                        container
                        direction="row"
                        justify="flex-end"
                        wrap="nowrap"
                        spacing={2}
                      >
                        <Grid item>
                          <TooltipIcon
                            type="internal"
                            title="Edit"
                            link={`/instructors/${instructor.id}`}
                            icon={<Edit />}
                          />
                        </Grid>
                        <Grid item>
                          <TooltipIcon
                            type="button"
                            title="Delete Instructor"
                            data-instructor-id={instructor.id}
                            onClick={deleteInstructor}
                            icon={<Delete />}
                          />
                        </Grid>
                      </Grid>

                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            )}
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
}

export default Instructors;
