/* eslint-disable react/no-multi-comp */
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Box,
  Button,
  Card,
  CardContent,
  Link,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Typography,
  colors,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import Label from 'src/components/Label';

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
  list: {
    '&:last-child': {
      marginBottom: 0,
    }
  },
  item: {
    transition: 'background-color 0.3s',
    '&:hover': {
      backgroundColor: colors.blue[100],
    }
  },
  link: {
    display: 'block',
  },
  updatedAt: {
    minWidth: '200px',
  },
  label: {
    color: colors.common.white,
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    minWidth: 'auto',
    marginLeft: theme.spacing(2),
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
  domain,
  deleteWepPage,
}) {
  const classes = useStyles();
  const API_URL = process.env.REACT_APP_API_URL;

  return (
    <Card className={clsx(classes.root, className)}>
      <CardContent className={classes.content}>
        <List className={classes.list}>
          {pages.map((page, i) => (
            <ListItem
              divider={i < pages.length - 1}
              className={classes.item}
              key={page.id}
            >
              <ListItemText>
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
              </ListItemText>

              <Box component="div" className={classes.updatedAt}>
                {Object.prototype.hasOwnProperty.call(page, 'publishedAt') && (
                  <Box component="div">
                    <Label color={colors.green[600]}>
                      <a
                        href={page.id === domain.homePageId
                          ? `http://${page.domain}`
                          : `http://${page.domain}/${page.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={classes.label}
                      >
                        {page.id === domain.homePageId
                          ? 'Published as Home Page'
                          : 'Published'}
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

              <Tooltip title="Preview">
                <a
                  href={`${API_URL}/preview/${page.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.button}
                >
                  <VisibilityIcon />
                </a>
              </Tooltip>
              <Tooltip title="Edit">
                <Link
                  component={RouterLink}
                  to={`/pages/${page.domainId}/${page.id}`}
                  variant="h5"
                  color="textPrimary"
                  underline="none"
                  className={classes.button}
                >
                  <EditIcon />
                </Link>
              </Tooltip>
              <Tooltip title="Delete Page">
                <Box component="span">
                  <Button
                    color="inherit"
                    underline="none"
                    data-page-id={page.id}
                    className={classes.button}
                    disabled={Object.prototype.hasOwnProperty.call(page, 'publishedAt')}
                    onClick={deleteWepPage}
                  >
                    <DeleteIcon />
                  </Button>
                </Box>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

PagesList.propTypes = {
  className: PropTypes.string,
  pages: PropTypes.array,
  domain: PropTypes.object,
  deleteWepPage: PropTypes.func,
};

export default PagesList;