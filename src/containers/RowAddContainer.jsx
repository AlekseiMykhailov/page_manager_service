import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { Form, Input } from '../components/Form';
import { Button } from '../components/Button';
import * as api from '../helpers/api';

export const RowAddContainer = ({ pageId, newRowOrder, getPageData }) => {
  const [rowSchemas, setRowSchemas] = useState([]);
  const [selectedRowSchemaId, setSelectedRowSchemaId] = useState('');
  const [selectedRowSchema, setSelectedRowSchema] = useState('');

  const API_URL = process.env.REACT_APP_API_URL;
  const { slug } = useParams();

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
    getRowSchemas();
  }, [getRowSchemas]);

  const handleSubmit = (e) => {
    e.preventDefault();

    api.postData(`${API_URL}/rows`, selectedRowSchema).then(res => {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;

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
  };

  const handleSelectRowSchema = (e) => {
    const { value } = e.target;
    const selectedSchema = {...rowSchemas.find(rowSchema => rowSchema.id === value)};

    selectedSchema.webPageId = pageId;
    selectedSchema.order = newRowOrder;
    selectedSchema.fields = selectedSchema.fields.map(field => ({
      ...field,
      value: '',
    }));

    setSelectedRowSchemaId(value);
    setSelectedRowSchema(selectedSchema);
  };

  return (
    <>
      {rowSchemas && (
        <Form
          id="new-row"
          className="Form--bordered"
          action={`${API_URL}/rows`}
          handleSubmit={handleSubmit}
          key="new-row"
        >
          <div className="Form__Header">
            <h2>Add New Row</h2>
            <select value={selectedRowSchemaId} onChange={handleSelectRowSchema}>
              <option></option>
              {rowSchemas.map(schema => (
                <option key={schema.id} value={schema.id}>
                  {schema.meta.title}
                </option>
              ))}
            </select>
          </div>
          <Input
            id="new-row-webPageId"
            name="webPageId"
            type="hidden"
            value={pageId}
            key="page-id"
          />
          <Input
            id="new-row-order"
            name="order"
            type="hidden"
            value={newRowOrder}
            key="new-row-order"
          />
          {selectedRowSchema && selectedRowSchema.fields.map(({name, type, value}) => (
            <Input
              id={name}
              name={name}
              type={type}
              value={value}
              label={name}
              handleChange={handleInputChange}
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
  );
};

RowAddContainer.propTypes = {
  pageId: PropTypes.string.isRequired,
  newRowOrder: PropTypes.number.isRequired,
  getPageData: PropTypes.func,
};
