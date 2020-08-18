/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React, { lazy } from 'react';
import { Redirect } from 'react-router-dom';
import DashboardLayout from './layouts/Dashboard';

export default [
  {
    path: '/',
    exact: true,
    component: () => <Redirect to="/pages" />
  },
  {
    route: '*',
    component: DashboardLayout,
    routes: [
      {
        path: '/domains-settings',
        exact: true,
        component: lazy(() => import('src/views/DomainsSettings'))
      },
      {
        path: '/domains-settings/:domainId',
        exact: true,
        component: lazy(() => import('src/views/DomainsSettings'))
      },
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
        path: '/pages/:domainId',
        exact: true,
        component: lazy(() => import('src/views/Pages'))
      },
      {
        path: '/pages/:domainId/:webPageId',
        exact: true,
        component: lazy(() => import('src/views/PageEdit'))
      },
    ]
  },
];
