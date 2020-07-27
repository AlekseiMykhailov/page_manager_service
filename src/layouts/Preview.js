import React, { Suspense } from 'react';
import { renderRoutes } from 'react-router-config';
import PropTypes from 'prop-types';
import { LinearProgress } from '@material-ui/core';

function Preview({ route }) {
  return (
    <Suspense fallback={<LinearProgress />}>
      {renderRoutes(route.routes)}
    </Suspense>
  );
}

Preview.propTypes = {
  route: PropTypes.object
};

export default Preview;
