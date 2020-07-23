import React from 'react';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import './Button.scss';

export const Button = ({
  children,
  handleClick,
  className = 'Button',
  activeClassName = 'Button--active',
  disabled,
  buttonType = 'button',
  color,
  ...attrs
}) => {

  const onClickAction = (e) => {
    if (disabled) {
      e.preventDefault();
    } else if (handleClick) {
      return handleClick(e);
    }
  };

  const classes = cn(
    'Button',
    className,
    { activeClassName },
  );

  if(attrs.href) {
    return (
      <Link
        to={attrs.href}
        className={classes}
        disabled={disabled}
        {...attrs}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      disabled={disabled}
      type={buttonType}
      onClick={onClickAction}
      {...attrs}
    >
      {children}
    </button>
  );
};
