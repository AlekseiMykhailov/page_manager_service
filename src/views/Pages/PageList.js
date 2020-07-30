/* eslint-disable react/no-multi-comp */
import React, { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  // IconButton,
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
import Label from 'src/components/Label';
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
    display: 'flex',
    alignItems: 'center',
    marginLeft: theme.spacing(2),

    '&:hover': {
      color: colors.blue[900],
    }
  }
}));

function PageList({ className, ...rest }) {
  const classes = useStyles();
  const [pages, setPages] = useState([]);
  const [publishedPages, setPublishedPages] = useState([]);

  // const [openFormBar, setOpenFormBar] = useState(false);
  // const [editingPage, setEditingPages] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL;
  const PUBLISH_URL = process.env.REACT_APP_PUBLISH_URL;

  const fetchPages = useCallback(() => {
    fetch.getData(`${API_URL}/pages`).then((response) => {
      setPages(response.pages);
    });
  }, [API_URL]);

  const fetchPublishedPages = useCallback(() => {
    fetch.getData(`${PUBLISH_URL}/published`).then((response) => {
      setPublishedPages(response.pages);
    });
  }, [PUBLISH_URL]);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  useEffect(() => {
    fetchPublishedPages();
  }, [fetchPublishedPages]);


  // const handleFormBarOpen = () => {
  //   setOpenFormBar(true);
  // };
  // const handleFormBarClose = () => {
  //   setOpenFormBar(false);
  // };

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        action={(
          <Link
            component={RouterLink}
            to="/pages/create"
            variant="button"
            color="primary"
            underline="none"
            className={classes.link}
          >
            <PostAddIcon className={classes.addIcon} />
            Add
          </Link>
        )}
        title="Pages"
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

              {publishedPages.find((published) => published.uuid === page.id) && (
                <Label color={colors.green[600]}>
                  Published
                </Label>
              )}

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
              {/* <Tooltip title="New Edit">
                <IconButton
                  className={classes.chatButton}
                  color="inherit"
                  onClick={handleFormBarOpen}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip> */}
            </ListItem>
          ))}
        </List>
        {/* <FormBar
          onClose={handleFormBarClose}
          open={openFormBar}
        /> */}
      </CardContent>
    </Card>
  );
}

PageList.propTypes = {
  className: PropTypes.string
};

export default PageList;
