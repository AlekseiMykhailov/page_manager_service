/* eslint-disable react/no-multi-comp */
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { removeStatusMessage, setStatusMessage } from 'src/actions/messageActions';
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
import DeleteIcon from '@material-ui/icons/Delete';
import * as CONST from 'src/utils/const';
import * as FETCH from 'src/utils/fetch';
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
    '&:hover': {
      backgroundColor: colors.blue[100],
    }
  },
  link: {
    display: 'block',
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

    '&:hover': {
      color: colors.blue[900],
    }
  },
  disabled: {
    marginLeft: theme.spacing(2),
    color: colors.grey[300],
  },
}));

function PagesList({ className, ...rest }) {
  const classes = useStyles();
  const [pages, setPages] = useState([]);
  const [homePageId, setHomePageId] = useState(null);

  const dispatch = useDispatch();
  const API_URL = process.env.REACT_APP_API_URL;

  const fetchPages = useCallback(() => {
    let pageList = [];

    FETCH.getData(`${API_URL}/pages`)
      .then((response) => { pageList = response.pages; })
      .then(() => FETCH.getData(`${API_URL}/published`))
      .then((published) => {
        const pagesWithPublishData = pageList.map((page) => {
          const publishedPageData = published.pages.find((publishedPage) => (
            publishedPage.webPageId === page.id
          ));

          if (publishedPageData) {
            return {
              ...page,
              published: {
                url: publishedPageData.url,
                publishedAt: publishedPageData.publishedAt,
              },
            };
          }

          return page;
        });

        setPages(pagesWithPublishData);
      });
  }, [API_URL]);

  const getHomePageData = useCallback(() => {
    FETCH.getData(`${API_URL}/homePage`)
      .then((response) => {
        if (response.ok) {
          setHomePageId(response.webPageId);
        }
      });
  }, [API_URL]);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  useEffect(() => {
    getHomePageData();
  }, [getHomePageData]);

  const handleResponse = (
    response,
    successAction,
    successMessage,
    errorMessage = 'Something went wrong...',
  ) => {
    if (response.ok) {
      dispatch(setStatusMessage(CONST.SUCCESS, successMessage));
      if (successAction) {
        successAction();
      }
    } else {
      dispatch(setStatusMessage(CONST.ERROR, errorMessage));
    }

    setTimeout(() => {
      dispatch(removeStatusMessage());
    }, CONST.TIME_VISIBILITY_MESSAGES);
  };

  const deleteWepPage = (e) => {
    const { slug } = e.currentTarget.dataset;

    FETCH.deleteData(`${API_URL}/pages/${slug}`)
      .then((response) => handleResponse(response, fetchPages, 'Page was deleted', response.err));
  };

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
          {pages && pages.map((page, i) => (
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

              {Object.prototype.hasOwnProperty.call(page, 'published') && (
                <Label color={colors.green[600]}>
                  <a
                    href={page.id === homePageId ? `http://${page.domain}` : page.published.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classes.label}
                  >
                    {page.id === homePageId ? 'Published as Home Page' : 'Published'}
                  </a>
                </Label>
              )}

              {!Object.prototype.hasOwnProperty.call(page, 'published') && (page.id === homePageId) && (
                <Label color={colors.yellow[900]}>
                  Home Page
                </Label>
              )}

              <Tooltip title="Preview">
                <Link
                  component={RouterLink}
                  to={`${API_URL}/preview/${page.slug}`}
                  variant="h5"
                  color="textPrimary"
                  underline="none"
                  className={classes.button}
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
                  className={classes.button}
                >
                  <EditIcon />
                </Link>
              </Tooltip>
              {!Object.prototype.hasOwnProperty.call(page, 'published') && (
                <Tooltip title="Delete Page">
                  <Button
                    color="inherit"
                    underline="none"
                    data-slug={page.slug}
                    className={classes.button}
                    onClick={deleteWepPage}
                  >
                    <DeleteIcon />
                  </Button>
                </Tooltip>
              )}
              {Object.prototype.hasOwnProperty.call(page, 'published') && (
                <DeleteIcon className={classes.disabled} />
              )}
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

PagesList.propTypes = {
  className: PropTypes.string,
};

export default PagesList;
