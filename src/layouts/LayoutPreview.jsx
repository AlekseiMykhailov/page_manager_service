import React from 'react';
import PropTypes from 'prop-types';
import { Nav } from '../Header';
import './Layout.scss';

export const LayoutPreview = ({ children }) => {
  return (
    <>
      <Nav />
      {children}
    </>
  );
};

LayoutPreview.propTypes = {
  children: PropTypes.element.isRequired,
};
