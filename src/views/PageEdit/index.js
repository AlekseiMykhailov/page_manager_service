import React, {
  useState, useCallback, useEffect, useMemo
} from 'react';
import clsx from 'clsx';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
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
  button: {
    paddingRight: theme.spacing(3),
    paddingLeft: theme.spacing(3),
    color: theme.palette.common.white,
  },
  publishButton: {
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900],
    }
  },
  unPublishButton: {
    backgroundColor: colors.red[600],
    '&:hover': {
      backgroundColor: colors.red[900],
    }
  },
}));

function PageCreate() {
  const [pageData, setPagesData] = useState(null);
  const [rowsData, setRowsData] = useState([]);
  const [publishData, setPublishData] = useState(null);

  const dispatch = useDispatch();
  const { slug } = useParams();
  const classes = useStyles();
  const API_URL = process.env.REACT_APP_API_URL;
  const PUBLISH_URL = process.env.REACT_APP_PUBLISH_URL;
  const publishBtnText = (publishData) ? 'Publish Update' : 'Publish';

  const getPageData = useCallback(() => {
    FETCH.getData(`${API_URL}/pages/${slug}`)
      .then((response) => {
        if (response.ok) {
          setPagesData(response.webPage);
          setRowsData(response.rows);
        }
      });
  }, [API_URL, slug]);

  const getPublishData = useCallback(() => {
    FETCH.getData(`${PUBLISH_URL}/published/${slug}`)
      .then((response) => {
        if (response.ok) {
          const { publishedAt, url } = response.data;
          setPublishData({ publishedAt, url });
        } else {
          setPublishData(null);
        }
      });
  }, [PUBLISH_URL, slug]);

  useEffect(() => {
    getPageData();
    getPublishData();
  }, [getPageData, getPublishData]);

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
    const { name, value } = e.target;

    setPagesData({ ...pageData, [name]: value });
  };

  const savePageData = (e) => {
    e.preventDefault();

    FETCH.putData(`${API_URL}/pages/${slug}`, pageData,)
      .then((response) => handleResponse(response, null, 'Page was edited'));
  };

  const resetPageData = () => {
    getPageData();
  };

  const saveRowData = (rowData) => {
    FETCH.putData(`${API_URL}/rows/${rowData.id}`, rowData)
      .then((response) => handleResponse(response, null, 'Row was edited'));
  };

  const handleSaveRow = (e) => {
    e.preventDefault();

    const { id } = e.target;
    const rowData = rowsData.find((row) => row.id === id);

    saveRowData(rowData);
  };

  const changeRowInput = (e) => {
    const { name, value } = e.target;
    const { rowId } = e.currentTarget.dataset;
    const rowsDataUpdated = [...rowsData].map((row) => {
      if (row.id === rowId) {
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
    saveRowData(updatedRows.find((row) => row.id === changingRows.rowA.id));
    saveRowData(updatedRows.find((row) => row.id === changingRows.rowB.id));
  };

  const handleRowsOrder = (e) => {
    const { direction, rowId } = e.currentTarget.dataset;
    const changingRows = {
      rowA: null,
      rowB: null,
    };

    rowsData.forEach((row, i) => {
      if (rowsData[i].id === rowId && direction === 'down' && i < (rowsData.length - 1)) {
        changingRows.rowA = {
          id: row.id,
          order: rowsData[i + 1].order,
        };
        changingRows.rowB = {
          id: rowsData[i + 1].id,
          order: row.order,
        };
      }

      if (rowsData[i].id === rowId && direction === 'up' && i > 0) {
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
            {publishData && (
              <Typography variant="body2">
                <Label color={colors.green[600]}>Published</Label>
                {moment(publishData.publishedAt).format('LLLL')}
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
                <Button
                  variant="contained"
                  className={clsx(classes.button, classes.previewButton)}
                  color="primary"
                  href={`/preview/${slug}`}
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
                  {publishBtnText}
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
                handleSubmit={handleSaveRow}
                handleInputChange={changeRowInput}
                handleDelete={deleteRow}
                handleChangeOrder={handleRowsOrder}
                key={row.id}
              />
            ))}

            {pageData && (
              <RowAddForm
                pageId={pageData.id}
                className={classes.section}
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
