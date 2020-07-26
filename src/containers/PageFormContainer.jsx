import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { Form, Input } from '../components/Form';

export const PageFormContainer = ({
  children,
  pageData,
  handleSubmit,
  handleInputChange,
}) => {
  const { slug } = useParams();
  const API_URL = process.env.REACT_APP_API_URL;

  return (
    <Form
      id="wep-page-data-form"
      className="Form--bordered"
      title={pageData.title}
      buttonPublish
      action={`${API_URL}/pages/${slug}`}
      handleSubmit={handleSubmit}
    >
      {Object.entries(pageData).map(([fieldName, fieldValue]) => {
        if (fieldName === 'title' || fieldName === 'description' || fieldName === 'slug') {
          return (
            <Input
              id={fieldName}
              name={fieldName}
              value={fieldValue}
              label={fieldName}
              disabled={fieldName === 'slug'}
              handleChange={handleInputChange}
              key={fieldName}
            />
          );
        }

        return '';
      })}
      <div className="Form__BlockButtons">
        {children}
      </div>
    </Form>
  );
};


PageFormContainer.propTypes = {
  children: PropTypes.element.isRequired,
  pageData: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
};
