import React from 'react';
import PropTypes from 'prop-types';
import './Input.scss';

export const Input = ({
  id,
  type = 'text',
  name,
  value,
  label,
  disabled,
  handleChange,
  ...attrs
}) => {
  return (
    <div className="Input">
      <label htmlFor={id} className="Input__Label">
        {label && (
          <span className="Input__LabelSpan">
            {label}
            {name === 'backgroundImageURL' && value && (
              <img src={value} alt={label} className="Input__Image" />
            )}
          </span>
        )}

        <input
          id={id}
          className="Input__Field"
          type={type}
          name={name}
          value={value}
          disabled={disabled}
          onChange={handleChange}
          {...attrs}
        />
      </label>
    </div>
  );
};

Input.defaultProps = {
  type: 'text',
  value: '',
  label: '',
  disabled: false,
  handleChange: () => {},
};

Input.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  label: PropTypes.string,
  disabled: PropTypes.bool,
  handleChange: PropTypes.func,
};
