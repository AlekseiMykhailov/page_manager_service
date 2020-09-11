import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Box,
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
import {
  Edit, Archive, Visibility, Language
} from '@material-ui/icons';
import Label from 'src/components/Label';
import TooltipIcon from 'src/components/TooltipIcon';

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    padding: 0,
    '&:last-child': {
      paddingBottom: 0,
    }
  },
  addIcon: {
    marginRight: theme.spacing(1),
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
  updatedAt: {
    minWidth: '220px',
  },
  label: {
    color: colors.common.white,
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
    marginLeft: theme.spacing(2),
    color: colors.grey[300],
  },
}));

function PagesList({
  className,
  pages,
  deleteWepPage,
}) {
  const classes = useStyles();
  const API_URL = process.env.REACT_APP_API_URL;

  return (
    <Card className={clsx(classes.root, className)}>
      <CardContent className={classes.content}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Pages</TableCell>
              <TableCell>Updated / Published</TableCell>
              <TableCell align="center">Indexing</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pages.map((page) => (
              <TableRow className={classes.row} key={page.id}>
                <TableCell>
                  <Link
                    component={RouterLink}
                    to={`/pages/${page.domainId}/${page.id}`}
                    variant="body1"
                    color="textPrimary"
                    underline="none"
                    className={classes.link}
                  >
                    <Box component="div">
                      <Box component="div">
                        <Typography variant="h5">
                          {page.title}
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        {page.description}
                      </Typography>
                    </Box>
                  </Link>
                </TableCell>
                <TableCell>
                  <Box component="div" className={classes.updatedAt}>
                    {Object.prototype.hasOwnProperty.call(page, 'publishedAt') && (
                      <Box component="div">
                        <Label color={colors.green[600]}>
                          <a
                            href={page.isHomePage
                              ? `http://${page.domain}`
                              : `http://${page.domain}/${page.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={classes.label}
                          >
                            {page.isHomePage ? 'Published as Home Page' : 'Published'}
                          </a>
                        </Label>
                      </Box>
                    )}
                    <Box component="div">
                      <Typography variant="body2">
                        {moment(page.updatedAt).format(' LLLL')}
                      </Typography>
                    </Box>
                  </Box>
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
                      {!page.disableIndexing && (
                        <TooltipIcon
                          type="icon"
                          title="Indexing of the Page"
                          icon={<Language />}
                        />
                      )}
                    </Grid>
                  </Grid>
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
                        title="Preview"
                        link={`${API_URL}/preview/${page.id}`}
                        icon={<Visibility />}
                      />
                    </Grid>
                    <Grid item>
                      <TooltipIcon
                        type="internal"
                        title="Edit"
                        link={`/pages/${page.domainId}/${page.id}`}
                        icon={<Edit />}
                      />
                    </Grid>
                    <Grid item>
                      <TooltipIcon
                        type="button"
                        title="Archive Page"
                        data-page-id={page.id}
                        disabled={Object.prototype.hasOwnProperty.call(page, 'publishedAt')}
                        onClick={deleteWepPage}
                        icon={<Archive />}
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

PagesList.propTypes = {
  className: PropTypes.string,
  pages: PropTypes.array,
  deleteWepPage: PropTypes.func,
};

export default PagesList;
