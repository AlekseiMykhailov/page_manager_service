import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
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
import { Edit } from '@material-ui/icons';
import TooltipIcon from 'src/components/TooltipIcon';

const useStyles = makeStyles(() => ({
  root: {},
  content: {
    padding: 0,
    '&:last-child': {
      paddingBottom: 0,
    }
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
  disabled: {
    color: colors.grey[300],
  },
}));

function SectionsList({
  className,
  sections,
}) {
  const classes = useStyles();

  return (
    <Card className={clsx(classes.root, className)}>
      <CardContent className={classes.content}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Section Title</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sections.map((section) => (
              <TableRow className={classes.row} key={section.id}>
                <TableCell>
                  <Link
                    component={RouterLink}
                    to={`/sections/${section.id}`}
                    variant="body1"
                    color="textPrimary"
                    underline="none"
                    className={classes.link}
                  >
                    <Typography variant="h5">
                      {section.title}
                    </Typography>
                  </Link>
                </TableCell>
                <TableCell>
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
                        link={`/section/${section.id}`}
                        icon={<Edit />}
                      />
                    </Grid>
                  </Grid>

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

SectionsList.propTypes = {
  className: PropTypes.string,
  sections: PropTypes.array,
};

export default SectionsList;
