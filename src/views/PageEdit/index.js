import React, {
  useState, useCallback, useEffect, useMemo
} from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { useStatusMessage } from 'src/hooks';
import {
  Card,
  CardContent,
  Container,
  Divider,
  colors,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Page from 'src/components/Page';
import * as FETCH from 'src/utils/fetch';
import PageEditForm from 'src/components/WebPage/PageEditForm';
import PageEditHeader from './PageEditHeader';
import PageEditButtons from './PageEditButtons';
import RowEditForm from './RowEditForm';
import RowAddForm from './RowAddForm';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  divider: {
    backgroundColor: colors.grey[300],
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
}));

function PageEdit() {
  const classes = useStyles();
  const [setStatusMessage] = useStatusMessage();
  const { domainId, webPageId } = useParams();
  const [pageSchema, setPageSchema] = useState(null);
  const [pageData, setPageData] = useState(null);
  const [rowsSchemas, setRowSchemas] = useState([]);
  const [rowsData, setRowsData] = useState([]);
  const [publishData, setPublishData] = useState(null);
  const [homePageId, setHomePageId] = useState(null);
  const [isDeleted, setIsDeleted] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;

  // TODO: combine into one fetch
  const getPageData = useCallback(() => {
    FETCH.getData(`${API_URL}/pages/${webPageId}`)
      .then((response) => {
        if (response.ok) {
          setPageData(response.webPage);
          setRowsData(response.rows);
          return response.webPage.domain;
        }
      })
      .then((domain) => FETCH.getData(`${API_URL}/domains/${domain}`))
      .then((response) => {
        if (response.ok) {
          setHomePageId(response.webPageId);
        }
      });
  }, [API_URL, webPageId]);

  const getPageSchema = useCallback(() => {
    FETCH.getData(`${API_URL}/schemas/pages`)
      .then((response) => {
        if (response.ok) {
          setPageSchema(response.schema);
        }
      });
  }, [API_URL]);

  const getRowSchemas = useCallback(() => {
    FETCH.getData(`${API_URL}/schemas/rows`)
      .then((response) => {
        if (response.ok) {
          setRowSchemas(response.schemas);
        }
      });
  }, [API_URL]);

  const getPublishData = useCallback(() => {
    FETCH.getData(`${API_URL}/published/${webPageId}`)
      .then((response) => {
        if (response.ok) {
          setPublishData(response.data);
        } else {
          setPublishData(null);
        }
      });
  }, [API_URL, webPageId]);

  useEffect(() => {
    getPageSchema();
    getRowSchemas();
    getPageData();
    getPublishData();
  }, [getPageData, getPublishData, getRowSchemas, getPageSchema]);

  const handlePageDataInputChange = (e) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      setPageData({ ...pageData, [name]: !pageData[name] });
    } else {
      setPageData({ ...pageData, [name]: value });
    }
  };

  const savePageData = (e) => {
    if (!e) {
      FETCH.putData(`${API_URL}/pages/${webPageId}`, pageData);
      return;
    }
    e.preventDefault();

    FETCH.putData(`${API_URL}/pages/${webPageId}`, pageData,)
      .then((response) => setStatusMessage(response, getPageData, 'Page was edited'));
  };

  const deleteWepPage = () => {
    FETCH.deleteData(`${API_URL}/pages/${pageData.id}`)
      .then((response) => setStatusMessage(response, setIsDeleted(true), 'Page was archived'));
  };

  const saveRowData = (rowData) => {
    FETCH.putData(`${API_URL}/rows/${rowData.id}`, rowData)
      .then((response) => {
        setStatusMessage(response, getPageData, 'Row was edited');

        if (response.ok) {
          getPageData();
          savePageData();
        }
      });
  };

  const saveRowOrder = (rowId, order) => {
    FETCH.putData(`${API_URL}/rows/order/${rowId}`, { rowId, order })
      .then((response) => {
        setStatusMessage(response, null, 'Row order was changed');

        if (response.ok) {
          savePageData();
        }
      });
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
      .then((response) => {
        setStatusMessage(response, getPageData, 'Row was deleted');

        if (response.ok) {
          savePageData();
        }
      });
  };

  const handlePublish = () => {
    const publishMethod = publishData ? FETCH.putData : FETCH.postData;
    const publishMessage = publishData
      ? 'Published page was updated'
      : 'Page was published';

    publishMethod(`${API_URL}/publish`, { webPageId })
      .then((response) => {
        setStatusMessage(response, getPublishData, publishMessage);

        if (response.ok) {
          savePageData();
        }
      });
  };

  const handleUnPublish = () => {
    FETCH.deleteData(`${API_URL}/publish/${webPageId}`)
      .then((response) => {
        setStatusMessage(response, getPublishData, 'Page was unpublished');

        if (response.ok) {
          savePageData();
        }
      });
  };

  const getSortedRows = useMemo(() => (
    rowsData.sort((a, b) => a.order - b.order)
  ), [rowsData]);

  return (
    <Page
      className={classes.root}
      title="Edit Page"
    >
      {isDeleted && (<Redirect to={`/pages/${domainId}`} />)}
      <Container maxWidth="lg">
        {pageData && (
          <PageEditHeader
            name="Edit Page"
            title={pageData.title}
            homePageId={homePageId}
            pageData={pageData}
            publishData={publishData}
          />
        )}
        {pageData && (
          <PageEditButtons
            pageId={pageData.id}
            homePageId={homePageId}
            isPublished={Boolean(publishData)}
            handleDelete={deleteWepPage}
            handlePublish={handlePublish}
            handleUnPublish={handleUnPublish}
          />
        )}
        <Divider className={classes.divider} />
        <Card>
          <CardContent>

            {pageData && (
              <PageEditForm
                pageSchema={pageSchema}
                pageData={pageData}
                className={classes.section}
                handleSubmit={savePageData}
                handleChange={handlePageDataInputChange}
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

export default PageEdit;
