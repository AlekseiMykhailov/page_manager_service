import cn from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import './Form.scss';
import { Button } from '../Button';

export const Form = ({
  action,
  method,
  className,
  title,
  buttonPublish,
  handleSubmit,
  children,
  ...attr
}) => {
  const classes = cn(
    'Form',
    className,
  );

  return (
    <>
      <div className="Form__Header--center">
        <h2>{title}</h2>
        {buttonPublish && <Button className="Button--success">Publish</Button>}
      </div>
      <form
        action={action}
        method={method}
        className={classes}
        onSubmit={handleSubmit}
        {...attr}
      >
        {children}
      </form>
    </>
  );
};

Form.defaultProps = {
  action: '',
  method: 'POST',
  className: '',
  title: '',
  buttonPublish: false,
  handleSubmit: () => {},
};

Form.propTypes = {
  action: PropTypes.string,
  method: PropTypes.string,
  className: PropTypes.string,
  title: PropTypes.string,
  buttonPublish: PropTypes.bool,
  handleSubmit: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.elementType,
    PropTypes.array,
  ]),
};
