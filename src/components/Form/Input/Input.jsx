import React from 'react';
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
