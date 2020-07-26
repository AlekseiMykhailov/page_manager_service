import cn from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import './Button.scss';

export const Button = ({
  children,
  handleClick,
  className,
  activeClassName = 'Button--active',
  disabled,
  buttonType = 'button',
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

Button.defaultProps = {
  handleClick: () => {},
  className: '',
  activeClassName: 'Button--active',
  disabled: false,
  buttonType: 'button',
};

Button.propTypes = {
  children: PropTypes.string.isRequired,
  handleClick: PropTypes.func,
  className: PropTypes.string,
  activeClassName: PropTypes.string,
  disabled: PropTypes.bool,
  buttonType: PropTypes.string,
};
