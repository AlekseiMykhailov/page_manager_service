import React, {
  useState, useEffect, useCallback, useMemo
} from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  Divider,
  Typography,
  colors,
} from '@material-ui/core';
import * as FETCH from 'src/utils/fetch';
import * as CONST from 'src/utils/const';
import { setStatusMessage, removeStatusMessage } from 'src/actions/messageActions';
import PageDataForm from './PageDataForm';
import RowEditForm from './RowEditForm';
import RowAddForm from './RowAddForm';

const useStyles = makeStyles((theme) => ({
  root: {},
  submitButton: {
    marginTop: theme.spacing(2)
  },
  divider: {
    backgroundColor: colors.grey[300],
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(3)
  },
  section: {
    '& + &': {
      marginTop: theme.spacing(5)
    }
  },
}));

function FormPageEdit({ className, ...rest }) {
  const [pageData, setPagesData] = useState(null);
  const [rowsData, setRowsData] = useState([]);

  const dispatch = useDispatch();
  const { slug } = useParams();
  const classes = useStyles();
  const API_URL = process.env.REACT_APP_API_URL;

  const getPageData = useCallback(() => {
    FETCH.getData(`${API_URL}/pages/${slug}`)
      .then((response) => {
        if (response.ok) {
          setPagesData(response.webPage);
          setRowsData(response.rows);
        } else if (response.error) {
          console.log(response.error);
        }
      });
  }, [API_URL, slug]);

  useEffect(() => {
    getPageData(slug);
  }, [slug, getPageData]);

  const handleStatusMessage = (status, text) => {
    dispatch(setStatusMessage(status, text));

    setTimeout(() => {
      dispatch(removeStatusMessage());
    }, CONST.TIME_VISIBILITY_MESSAGES);
  };

  const handlePageDataInputChange = (e) => {
    const { name, value } = e.target;
    const pageDataUpdated = { ...pageData };

    pageDataUpdated[name] = value;
    setPagesData(pageDataUpdated);
  };

  const savePageData = (e) => {
    e.preventDefault();

    FETCH.putData(
      `${API_URL}/pages/${slug}`,
      pageData,
    ).then((response) => {
      if (response.ok) {
        console.log(response);
        handleStatusMessage(CONST.SUCCESS, 'Page was edited');
      } else {
        console.log(`Error: ${response}`);
        handleStatusMessage(CONST.ERROR, 'Something went wrong...');
      }
    });
  };

  const resetPageData = () => {
    getPageData();
  };

  const saveRowData = (rowData) => {
    FETCH.putData(
      `${API_URL}/rows/${rowData.id}`,
      rowData,
    ).then((response) => {
      if (response.ok) {
        console.log(response);
        handleStatusMessage(CONST.SUCCESS, 'Row was edited');
      } else {
        console.log(`Error: ${JSON.stringify(response)}`);
        handleStatusMessage(CONST.ERROR, 'Something went wrong...');
      }
    });
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
    e.preventDefault();

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
    e.preventDefault();

    const { rowId } = e.currentTarget.dataset;

    FETCH.deleteData(
      `${API_URL}/rows/${rowId}`
    ).then((response) => {
      if (response.ok) {
        getPageData(slug);
        handleStatusMessage(CONST.SUCCESS, `Row ID: "${response.id}" was deleted`);
      } else {
        console.log(`Error: ${JSON.stringify(response)}`);
        handleStatusMessage(CONST.ERROR, 'Something went wrong...');
      }
    });
  };

  const getSortedRows = useMemo(() => (
    rowsData.sort((a, b) => a.order - b.order)
  ), [rowsData]);

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent>
        {pageData && (
          <>
            <Typography
              gutterBottom
              variant="h3"
            >
              {pageData.title}
            </Typography>
            <PageDataForm
              pageData={pageData}
              className={classes.section}
              handleSubmit={savePageData}
              handleChange={handlePageDataInputChange}
              handleReset={resetPageData}
            />
            {getSortedRows.map((row, i) => (
              <React.Fragment key={row.id}>
                <Divider className={classes.divider} />
                <RowEditForm
                  row={row}
                  index={i}
                  maxIndex={rowsData.length - 1}
                  className={classes.section}
                  handleSubmit={handleSaveRow}
                  handleInputChange={changeRowInput}
                  handleDelete={deleteRow}
                  handleChangeOrder={handleRowsOrder}
                />
              </React.Fragment>
            ))}
            <Divider className={classes.divider} />
            <RowAddForm
              pageId={pageData.id}
              className={classes.section}
              newRowOrder={rowsData.length + 1}
              getPageData={getPageData}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}

FormPageEdit.propTypes = {
  className: PropTypes.string
};

export default FormPageEdit;
