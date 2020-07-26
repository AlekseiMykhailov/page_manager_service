import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { Spinner } from '../components/Spinner';
import { PageFormContainer } from '../containers/PageFormContainer';
import { RowAddContainer } from '../containers/RowAddContainer';
import { RowEditContainer } from '../containers/RowEditContainer';
import * as API from '../helpers/api';
import * as CONST from '../helpers/const';
import { Layout } from '../layouts';
import { setStatusMessage, removeStatusMessage } from '../actions/messageActions';

export const PageEdit = () => {
  const [pageData, setPagesData] = useState(null);
  const [rowsData, setRowsData] = useState([]);

  const dispatch = useDispatch();

  const { slug } = useParams();
  const API_URL = process.env.REACT_APP_API_URL;

  const getPageData = useCallback(slug => {
    API.getData(`${API_URL}/pages/${slug}`)
      .then(res => {
        if (res.ok) {
          setPagesData(res.webPage);
          setRowsData(res.rows);
        } else if (res.error) {
          console.log(res.error);
        }
      });
  }, [API_URL]);


  useEffect(() => {
    getPageData(slug);
  }, [slug, getPageData]);

  const handleStatusMessage = (status, text) => {
    dispatch(setStatusMessage(status, text));

    setTimeout(() => {
      dispatch(removeStatusMessage());
    }, CONST.TIME_VISIBILITY_MESSAGES);
  };

  const handleWebPageInputChange = (e) => {
    const { name, value } = e.target;
    const pageDataUpdated = {...pageData};

    pageDataUpdated[name] = value;
    setPagesData(pageDataUpdated);
  };

  const savePageData = (e) => {
    e.preventDefault();

    API.putData(
      e.target.action,
      pageData,
    ).then(res => {
      if (res.ok) {
        console.log(res);
        handleStatusMessage(CONST.SUCCESS, 'Page was edited');
      } else {
        console.log(`Error: ${res}`);
        handleStatusMessage(CONST.ERROR, 'Something went wrong...');
      }
    });
  };

  const resetPageData = () => {
    getPageData(slug);
  };

  const saveRowData = (rowData) => {
    API.putData(`${API_URL}/rows/${rowData.id}`, rowData).then(res => {
      if (res.ok) {
        console.log(res);
        handleStatusMessage(CONST.SUCCESS, 'Row was edited');
      } else {
        console.log(`Error: ${JSON.stringify(res)}`);
        handleStatusMessage(CONST.ERROR, 'Something went wrong...');
      }
    });
  };

  const handleSaveRow = (e) => {
    e.preventDefault();

    const { id } = e.target;
    const rowData = rowsData.find(row => row.id === id);

    saveRowData(rowData);
  };

  const changeRowInput = (e) => {
    const { name, value } = e.target;
    const { rowId } = e.currentTarget.dataset;
    const rowsDataUpdated = [...rowsData].map(row => {
      if (row.id === rowId) {
        return {
          ...row,
          fields: [...row.fields].map(field => {
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
    const updatedRows = rowsData.map(row => {
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
    saveRowData(updatedRows.find(row => row.id === changingRows.rowA.id));
    saveRowData(updatedRows.find(row => row.id === changingRows.rowB.id));
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

    API.deleteData(`${API_URL}/rows/${rowId}`).then(res => {
      if (res.ok) {
        getPageData(slug);
        handleStatusMessage(CONST.SUCCESS, `Row ID: "${res.id}" was deleted`);
      } else {
        console.log(`Error: ${JSON.stringify(res)}`);
        handleStatusMessage(CONST.ERROR, 'Something went wrong...');
      }
    });
  };

  const getSortedRows = useMemo(() => (
    rowsData.sort((a, b) => a.order - b.order)
  ), [rowsData]);

  return (
    <Layout title="Web Pages">
      <>
        {!pageData && <Spinner />}
        {pageData && (
          <>
            <PageFormContainer
              pageData={pageData}
              handleSubmit={savePageData}
              handleInputChange={handleWebPageInputChange}
            >
              <>
                <Button className="Button--empty" handleClick={resetPageData}>Reset</Button>
                <Button href={`/preview/${slug}`} className="Button--empty">Preview</Button>
                <Button buttonType="submit">Save changes</Button>
              </>
            </PageFormContainer>
            {getSortedRows.map((row, i) => (
              <RowEditContainer
                row={row}
                index={i}
                maxIndex={rowsData.length - 1}
                handleSubmit={handleSaveRow}
                handleInputChange={changeRowInput}
                handleDelete={deleteRow}
                handleChangeOrder={handleRowsOrder}
                key={row.id}
              />
            ))}

            <RowAddContainer
              pageId={pageData.id}
              newRowOrder={rowsData.length + 1}
              getPageData={getPageData}
            />
          </>
        )}
      </>
    </Layout>
  );
};
