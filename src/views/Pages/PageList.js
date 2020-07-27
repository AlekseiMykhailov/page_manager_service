/* eslint-disable react/no-multi-comp */
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Link,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  colors,
} from '@material-ui/core';
import PostAddIcon from '@material-ui/icons/PostAdd';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
import PublishIcon from '@material-ui/icons/Publish';
import * as fetch from 'src/utils/fetch';

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
    '&:hover': {
      backgroundColor: colors.blue[100],
    }
  },
  link: {
    display: 'block',
    marginLeft: theme.spacing(2),

    '&:hover': {
      color: colors.blue[900],
    }
  }
}));

function PageList({ className, ...rest }) {
  const classes = useStyles();
  const [pages, setPages] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    let mounted = true;

    const fetchPages = () => {
      fetch.getData(`${API_URL}/pages`).then((response) => {
        if (mounted) {
          setPages(response.pages);
        }
      });
    };

    fetchPages();

    return () => {
      mounted = false;
    };
  }, [API_URL]);

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        action={(
          <Button
            color="primary"
            size="small"
            href="/pages/create"
          >
            <PostAddIcon className={classes.addIcon} />
            Add
          </Button>
        )}
        title=""
      />
      <Divider />
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
                  to={`/pages/${page.slug}`}
                  variant="body1"
                  color="textPrimary"
                  underline="none"
                  className={classes.link}
                >
                  {page.title}
                </Link>
              </ListItemText>
              <Tooltip title="Publish">
                <Link
                  component={RouterLink}
                  to="#"
                  variant="h5"
                  color="textPrimary"
                  underline="none"
                  className={classes.link}
                  target="_blank"
                >
                  <PublishIcon />
                </Link>
              </Tooltip>
              <Tooltip title="Preview">
                <Link
                  component={RouterLink}
                  to={`/preview/${page.slug}`}
                  variant="h5"
                  color="textPrimary"
                  underline="none"
                  className={classes.link}
                  target="_blank"
                >
                  <VisibilityIcon />
                </Link>
              </Tooltip>
              <Tooltip title="Edit">
                <Link
                  component={RouterLink}
                  to={`/pages/${page.slug}`}
                  variant="h5"
                  color="textPrimary"
                  underline="none"
                  className={classes.link}
                >
                  <EditIcon />
                </Link>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

PageList.propTypes = {
  className: PropTypes.string
};

export default PageList;
