import React from 'react';
import cn from 'classnames';
import './Form.scss';

export const Form = ({
  action,
  method,
  className,
  handleSubmit,
  children,
  ...attr
}) => {
  const classes = cn(
    'Form',
    className,
  );

  return (
    <form
      action={action}
      method={method}
      className={classes}
      onSubmit={handleSubmit}
      {...attr}
    >
      {children}
    </form>
  );
};
