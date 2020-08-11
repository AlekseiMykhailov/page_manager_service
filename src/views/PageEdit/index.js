import React, {
  useState, useCallback, useEffect, useMemo
} from 'react';
import clsx from 'clsx';
import { useDispatch } from 'react-redux';
import { Redirect, useParams } from 'react-router-dom';
import moment from 'moment';
import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Typography,
  colors,
} from '@material-ui/core';
import PublishIcon from '@material-ui/icons/Publish';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/styles';
import { removeStatusMessage, setStatusMessage } from 'src/actions/messageActions';
import Page from 'src/components/Page';
import Label from 'src/components/Label';
import * as CONST from 'src/utils/const';
import * as FETCH from 'src/utils/fetch';
import PageDataForm from './PageDataForm';
import RowEditForm from './RowEditForm';
import RowAddForm from './RowAddForm';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  divider: {
    backgroundColor: colors.grey[300],
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  label: {
    color: theme.palette.common.white,
  },
  button: {
    paddingRight: theme.spacing(3),
    paddingLeft: theme.spacing(3),
    color: theme.palette.common.white,
  },
  deleteButton: {
    color: theme.palette.common.white,
    backgroundColor: colors.red[600],
    '&:hover': {
      backgroundColor: colors.red[900]
    }
  },
  publishButton: {
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900],
    }
  },
  unPublishButton: {
    backgroundColor: colors.yellow[600],
    '&:hover': {
      backgroundColor: colors.yellow[900],
    }
  },
  published: {
    display: 'flex',
    alignItems: 'center',
  },
}));

function PageCreate() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { slug } = useParams();
  const [pageData, setPagesData] = useState(null);
  const [rowsSchemas, setRowSchemas] = useState([]);
  const [rowsData, setRowsData] = useState([]);
  const [publishData, setPublishData] = useState(null);
  const [homePageId, setHomePageId] = useState(null);
  const [isDeleted, setIsDeleted] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;

  const getPageData = useCallback(() => {
    FETCH.getData(`${API_URL}/pages/${slug}`)
      .then((response) => {
        if (response.ok) {
          setPagesData(response.webPage);
          setRowsData(response.rows);
        }
      });
  }, [API_URL, slug]);

  const getHomePageId = useCallback(() => {
    FETCH.getData(`${API_URL}/homePage`)
      .then((response) => {
        if (response.ok) {
          setHomePageId(response.webPageId);
        }
      });
  }, [API_URL]);

  const getHomeRowSchemas = useCallback(() => {
    FETCH.getData(`${API_URL}/schemas/rows`)
      .then((response) => {
        if (response.ok) {
          setRowSchemas(response.schemas);
        }
      });
  }, [API_URL]);

  const getPublishData = useCallback(() => {
    FETCH.getData(`${API_URL}/published/${slug}`)
      .then((response) => {
        if (response.ok) {
          const { publishedAt, url } = response.data;
          setPublishData({ publishedAt, url });
        } else {
          setPublishData(null);
        }
      });
  }, [API_URL, slug]);

  useEffect(() => {
    getPageData();
    getPublishData();
    getHomePageId();
    getHomeRowSchemas();
  }, [getPageData, getPublishData, getHomePageId, getHomeRowSchemas]);

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

  const handlePageDataInputChange = (e) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      setPagesData({ ...pageData, [name]: !pageData[name] });
    } else {
      setPagesData({ ...pageData, [name]: value });
    }
  };

  const savePageData = (e) => {
    e.preventDefault();

    FETCH.putData(`${API_URL}/pages/${slug}`, pageData,)
      .then((response) => handleResponse(response, getHomePageId, 'Page was edited'));
  };

  const resetPageData = () => {
    getPageData();
  };

  const deleteWepPage = () => {
    FETCH.deleteData(`${API_URL}/pages/${slug}`)
      .then((response) => handleResponse(response, setIsDeleted(true), 'Page was deleted', response.err));
  };

  const saveRowData = (rowData) => {
    FETCH.putData(`${API_URL}/rows/${rowData.id}`, rowData)
      .then((response) => {
        handleResponse(response, null, 'Row was edited');

        if (response.ok) {
          getPageData();
        }
      });
  };

  const saveRowOrder = (rowId, order) => {
    FETCH.putData(`${API_URL}/rows/order/${rowId}`, { rowId, order })
      .then((response) => handleResponse(response, null, 'Row order was changed'));
  };

  const handleSaveRow = (e) => {
    e.preventDefault();

    const { id } = e.target;
    const rowData = rowsData.find((row) => row.id === +id);

    saveRowData(rowData);
  };

  const changeRowInput = (e) => {
    const { name, value } = e.target;
    const { rowId } = e.currentTarget.dataset;
    const rowsDataUpdated = [...rowsData].map((row) => {
      if (row.id === +rowId) {
        return {
          ...row,
          fields: [...row.fields].map((field) => {
            if (field.name === name) {
              return {
                ...field,
                value,
              };
            }

            return field;
          }),
        };
      }

      return row;
    });

    setRowsData(rowsDataUpdated);
  };

  const changeRowsOrder = (changingRows) => {
    const updatedRows = rowsData.map((row) => {
      if (row.id === changingRows.rowA.id) {
        return {
          ...row,
          order: changingRows.rowA.order,
        };
      }

      if (row.id === changingRows.rowB.id) {
        return {
          ...row,
          order: changingRows.rowB.order,
        };
      }

      return row;
    });

    setRowsData(updatedRows);
    updatedRows.forEach(({ id, order }) => saveRowOrder(id, order));
  };

  const handleRowsOrder = (e) => {
    const { direction, rowId } = e.currentTarget.dataset;
    const changingRows = {
      rowA: null,
      rowB: null,
    };

    rowsData.forEach((row, i) => {
      if (rowsData[i].id === +rowId && direction === 'down' && i < (rowsData.length - 1)) {
        changingRows.rowA = {
          id: row.id,
          order: rowsData[i + 1].order,
        };
        changingRows.rowB = {
          id: rowsData[i + 1].id,
          order: row.order,
        };
      }

      if (rowsData[i].id === +rowId && direction === 'up' && i > 0) {
        changingRows.rowA = {
          id: row.id,
          order: rowsData[i - 1].order,
        };
        changingRows.rowB = {
          id: rowsData[i - 1].id,
          order: row.order,
        };
      }
    });

    if (changingRows.rowA && changingRows.rowB) {
      changeRowsOrder(changingRows);
    }
  };

  const addField = (e) => {
    const { rowId } = e.currentTarget.dataset;
    const rowData = rowsData.find((row) => row.id === +rowId);
    const sortedFields = rowData.fields.sort((a, b) => a.order - b.order);
    const lastOrder = sortedFields[sortedFields.length - 1].order;
    const rowSchema = rowsSchemas.find((schema) => schema.id === rowData.schemaId);
    const clonableField = rowSchema.fields.find((field) => field.clonable);
    const newField = {
      ...clonableField,
      name: `${clonableField.name}-${lastOrder + 1}`,
      order: lastOrder + 1,
      value: '',
    };
    const newRowsData = rowsData.map((row) => {
      if (row.id !== +rowId) {
        return row;
      }

      return {
        ...row,
        fields: [...row.fields, newField],
      };
    });

    setRowsData(newRowsData);
  };

  const deleteRow = (e) => {
    const { rowId } = e.currentTarget.dataset;

    FETCH.deleteData(`${API_URL}/rows/${rowId}`)
      .then((response) => handleResponse(response, getPageData, 'Row was deleted'));
  };

  const handlePublish = () => {
    const publishMethod = publishData ? FETCH.putData : FETCH.postData;

    publishMethod(`${API_URL}/publish`, { slug })
      .then((response) => handleResponse(response, getPublishData, 'Page was published'));
  };

  const handleUnPublish = () => {
    FETCH.deleteData(`${API_URL}/publish/${slug}`)
      .then((response) => handleResponse(response, getPublishData, 'Page was unpublished'));
  };

  const getSortedRows = useMemo(() => (
    rowsData.sort((a, b) => a.order - b.order)
  ), [rowsData]);

  return (
    <Page
      className={classes.root}
      title="Edit Page"
    >
      {isDeleted && (<Redirect to="/pages" />)}
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid item>
            <Typography variant="overline">Pages</Typography>
            <Typography gutterBottom variant="h3">Edit Page</Typography>
            {pageData && publishData && (
              <Typography variant="body2" className={classes.published}>
                <Label color={colors.green[600]}>
                  <a
                    href={pageData.id === homePageId ? `http://${pageData.domain}` : publishData.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classes.label}
                  >
                    {pageData.id === homePageId ? 'Published as Home Page' : 'Published'}
                  </a>
                </Label>
                {moment(publishData.publishedAt).format(' LLLL')}
              </Typography>
            )}
          </Grid>
          <Grid item>
            {pageData && (
              <ButtonGroup
                variant="contained"
                size="large"
                aria-label="large outlined button group"
                className={classes.buttons}
              >
                {!publishData && (
                  <Button
                    variant="contained"
                    className={clsx(classes.button, classes.deleteButton)}
                    onClick={deleteWepPage}
                    startIcon={<DeleteIcon />}
                  >
                    Delete Page
                  </Button>
                )}
                <Button
                  variant="contained"
                  className={clsx(classes.button, classes.previewButton)}
                  color="primary"
                  href={`${API_URL}/preview/${slug}`}
                  target="_blank"
                  startIcon={<VisibilityIcon />}
                >
                  Preview
                </Button>
                {publishData && (
                  <Button
                    variant="contained"
                    className={clsx(classes.button, classes.unPublishButton)}
                    onClick={handleUnPublish}
                    startIcon={<DeleteIcon />}
                  >
                    UnPublish
                  </Button>
                )}
                <Button
                  variant="contained"
                  className={clsx(classes.button, classes.publishButton)}
                  onClick={handlePublish}
                  startIcon={<PublishIcon />}
                >
                  {publishData ? 'Publish Update' : 'Publish'}
                </Button>
              </ButtonGroup>
            )}
          </Grid>
        </Grid>
        <Divider className={classes.divider} />
        <Card>
          <CardContent>

            {pageData && (
              <PageDataForm
                pageData={pageData}
                className={classes.section}
                handleSubmit={savePageData}
                handleChange={handlePageDataInputChange}
                handleReset={resetPageData}
              />
            )}

            {getSortedRows.map((row, i) => (
              <RowEditForm
                row={row}
                index={i}
                maxIndex={rowsData.length - 1}
                className={classes.section}
                schemas={rowsSchemas}
                handleSubmit={handleSaveRow}
                handleInputChange={changeRowInput}
                handleDelete={deleteRow}
                handleChangeOrder={handleRowsOrder}
                handleAddField={addField}
                key={row.id}
              />
            ))}

            {pageData && (
              <RowAddForm
                pageId={pageData.id}
                className={classes.section}
                schemas={rowsSchemas}
                newRowOrder={rowsData.length + 1}
                getPageData={getPageData}
              />
            )}

          </CardContent>
        </Card>
      </Container>
    </Page>
  );
}

export default PageCreate;
