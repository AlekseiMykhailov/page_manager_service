import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { Form, Input } from '../components/Form';
import { Layout } from '../components/Layout';
import { Spinner } from '../components/Spinner';
import * as api from '../helpers/api';

export const FormEditPage = () => {
  const [pageMainData, setPagesMainData] = useState(null);
  const [rowsData, setRowsData] = useState([]);
  const [rowSchemas, setRowSchemas] = useState([]);
  const [selectedRowSchemaId, setSelectedRowSchemaId] = useState('');
  const [selectedRowSchema, setSelectedRowSchema] = useState('');

  const { slug } = useParams();
  const API_URL = process.env.REACT_APP_API_URL;

  const getPageData = useCallback((slug) => {
    api.getData(`${API_URL}/api/pages/${slug}`)
      .then(res => {
        if (res.ok) {
          setPagesMainData(res.webPage);
          setRowsData(res.rows);
        } else if (res.error) {
          console.log(res.error);
        }
      });
  }, [API_URL]);

  const getRowSchemas = useCallback(() => {
    api.getData(`${API_URL}/rows/schemas`)
      .then(res => {
        if (res.ok) {
          setRowSchemas(res.schemas);
        } else if (res.error) {
          console.log(res.error);
        }
      });
  }, [API_URL]);

  useEffect(() => {
    getPageData(slug);
    getRowSchemas();
  }, [slug, getPageData, getRowSchemas]);

  const handleSubmitPageData = (e) => {
    e.preventDefault();

    api.putData(
      e.target.action,
      pageMainData,
    ).then(res => {
      if (res.ok) {
        console.log(res);
      } else {
        console.log(`Error: ${res}`);
      }
    });
  };

  const handleSaveRowData = (e) => {
    e.preventDefault();

    const { action, id } = e.target;
    const formData = rowsData.find(row => row.id === id);

    api.putData(action, formData).then(res => {
      if (res.ok) {
        console.log(res);
      } else {
        console.log(`Error: ${JSON.stringify(res)}`);
      }
    });
  };

  const handleSubmitNewRow = (e) => {
    e.preventDefault();
    const { action } = e.target;

    api.postData(action, selectedRowSchema).then(res => {
      if (res.ok) {
        console.log(res);
        setSelectedRowSchemaId('');
        setSelectedRowSchema('');
        getPageData(slug);
      } else {
        console.log(`Error: ${JSON.stringify(res)}`);
      }
    });

  };

  const handleWebPageInputChange = (e) => {
    const { name, value } = e.target;
    const pageDataUpdated = {...pageMainData};

    pageDataUpdated[name] = value;
    setPagesMainData(pageDataUpdated);
  };

  const handleRowInputChange = (e) => {
    const { name, value } = e.target;
    const rowId = e.currentTarget.attributes['data-row-id'].value;
    let rowsDataUpdated;

    if (name === 'order') {

      rowsDataUpdated = [...rowsData].map(row => {
        if (row.id === rowId) {
          return {
            ...row,
            order: value,
          };
        }

        return row;
      });
    } else {
      rowsDataUpdated = [...rowsData].map(row => {
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
    }

    setRowsData(rowsDataUpdated);
  };

  const handleNewRowInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'order') {
      setSelectedRowSchema({
        ...selectedRowSchema,
        order: value,
      });
    } else {
      setSelectedRowSchema({
        ...selectedRowSchema,
        fields: [...selectedRowSchema.fields].map(field => {
          if (field.name === name) {
            return {
              ...field,
              value,
            };
          }

          return field;
        }),
      });
    }
  };

  const deleteRow = (e) => {
    e.preventDefault();

    const rowId = e.currentTarget.attributes['data-row-id'].value;

    api.deleteData(`${API_URL}/rows/${rowId}`).then(res => {
      if (res.ok) {
        getPageData(slug);
      } else {
        console.log(`Error: ${JSON.stringify(res)}`);
      }
    });
  };

  const handleSelectRowSchema = (e) => {
    const { value } = e.target;
    const selectedSchema = {...rowSchemas.find(rowSchema => rowSchema.id === value)};

    selectedSchema.webPageId = pageMainData.id;
    selectedSchema.fields = selectedSchema.fields.map(field => ({
      ...field,
      value: '',
    }));

    setSelectedRowSchemaId(value);
    setSelectedRowSchema(selectedSchema);
  };

  const getSortedRows = useMemo(() => (
    rowsData.sort((a, b) => a.order - b.order)
  ), [rowsData]);

  return (
    <Layout title="Web Pages">
      <>
        {!pageMainData && <Spinner />}
        {pageMainData && (
          <>
            <h1>Edit Web Pages</h1>
            <h2>{pageMainData.title}</h2>
            <Form
              id="wep-page-data"
              action={`${API_URL}/pages/${slug}`}
              handleSubmit={handleSubmitPageData}
            >
              {Object.entries(pageMainData).map(([fieldName, fieldValue]) => {
                if (fieldName === 'title' || fieldName === 'description' || fieldName === 'slug') {
                  return (
                    <Input
                      id={fieldName}
                      name={fieldName}
                      value={fieldValue}
                      label={fieldName}
                      disabled={fieldName === 'slug'}
                      handleChange={handleWebPageInputChange}
                      key={fieldName}
                    />
                  );
                }

                return '';
              })}
              <div className="Form__BlockButtons">
                <Button href="/pages" className="Button--empty">Cancel</Button>
                <Button href={`/preview/${slug}`} className="Button--empty">Preview</Button>
                <Button buttonType="submit">Save changes</Button>
                <Button className="Button--empty">Publish Page</Button>
              </div>
            </Form>
            {getSortedRows.map(row => (
              <Form
                id={row.id}
                className="Form--bordered"
                action={`${API_URL}/rows/${row.id}`}
                data-row-id={row.id}
                handleSubmit={handleSaveRowData}
                key={row.id}
              >
                <h2>{row.schema.title}</h2>
                <Input
                  id={`${row.id}-order`}
                  data-row-id={row.id}
                  name="order"
                  type="number"
                  value={row.order}
                  label="Order"
                  handleChange={handleRowInputChange}
                  key="order"
                />

                {row.fields && row.fields.map(({name, type,value }) => (
                  <Input
                    id={`${row.id}-${name}`}
                    data-row-id={row.id}
                    name={name}
                    type={type}
                    value={value}
                    label={name}
                    handleChange={handleRowInputChange}
                    key={name}
                  />
                ))}
                <div className="Form__BlockButtons">
                  <Button type="submit">Save row</Button>
                  <Button
                    type="submit"
                    className="Button--danger"
                    data-row-id={row.id}
                    onClick={deleteRow}
                  >Delete row</Button>
                </div>
              </Form>
            ))}

            {rowSchemas && (
              <Form
                id="new-row"
                className="Form--bordered"
                action={`${API_URL}/rows`}
                handleSubmit={handleSubmitNewRow}
                key="new-row"
              >
                <h2>Add New Row</h2>
                <select value={selectedRowSchemaId} onChange={handleSelectRowSchema}>
                  <option></option>
                  {rowSchemas.map(schema => (
                    <option key={schema.id} value={schema.id}>
                      {schema.schema.title}
                    </option>
                  ))}
                </select>
                <Input
                  name="webPageId"
                  type="hidden"
                  value={pageMainData.id}
                  key="page-id"
                />
                {selectedRowSchemaId && (
                  <Input
                    name="order"
                    type="number"
                    value={selectedRowSchema.order}
                    label="Order"
                    handleChange={handleNewRowInputChange}
                    key="order"
                  />
                )}
                {selectedRowSchema && selectedRowSchema.fields.map(({name, type, value}) => (
                  <Input
                    name={name}
                    type={type}
                    value={value}
                    label={name}
                    handleChange={handleNewRowInputChange}
                    key={name}
                  />
                ))}
                {selectedRowSchemaId && (
                  <div className="Form__BlockButtons">
                    <Button type="submit">Add row</Button>
                  </div>
                )}
              </Form>
            )}
          </>
        )}
      </>
    </Layout>
  );
};
