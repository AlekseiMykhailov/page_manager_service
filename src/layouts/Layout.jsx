import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import { getStatusMessage } from '../selectors';
import './Layout.scss';

export const Layout = ({ children, title }) => {
  const statusMessage = useSelector(getStatusMessage);
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet" />
      </Helmet>

      <main className="Layout">
        <div className="Layout__Container container">
          {children}
        </div>
      </main>
      {statusMessage.text && (
        <div className={`Layout__StatusMessage Layout__StatusMessage--${statusMessage.status}`}>
          {statusMessage.text}
        </div>
      )}
    </>
  );
};

Layout.defaultProps = {
  title: 'JobEasy Dashboard',
};

Layout.propTypes = {
  children: PropTypes.element.isRequired,
  title: PropTypes.string,
};
