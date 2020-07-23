import React from 'react';
import { Helmet } from 'react-helmet';
import { Nav } from '../Header';
import './Layout.scss';

export const LayoutPreview = ({ children, title}) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet" />
      </Helmet>

      <Nav />
      {children}
    </>
  );
};
