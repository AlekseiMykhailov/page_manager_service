/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React, { lazy } from 'react';
import { Redirect } from 'react-router-dom';
import PreviewLayout from './layouts/Preview';
import DashboardLayout from './layouts/Dashboard';

export default [
  {
    path: '/',
    exact: true,
    component: () => <Redirect to="/pages" />
  },
  {
    path: '/preview',
    component: PreviewLayout,
    routes: [
      {
        path: '/preview/:slug',
        exact: true,
        component: lazy(() => import('src/views/PagePreview'))
      },
    ],
  },
  {
    route: '*',
    component: DashboardLayout,
    routes: [
      {
        path: '/pages',
        exact: true,
        component: lazy(() => import('src/views/Pages'))
      },
      {
        path: '/pages/create',
        exact: true,
        component: lazy(() => import('src/views/PageCreate'))
      },
      {
        path: '/pages/:slug',
        exact: true,
        component: lazy(() => import('src/views/PageEdit'))
      },
    ]
  },
];
