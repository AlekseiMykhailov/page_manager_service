import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Dashboard, Pages, CreatePage, FormEditPage, PreviewPage } from '../pages';

export const Routes = () => {
  return (
    <Switch>
      <Route path="/" exact component={Dashboard} />
      <Route path="/pages" exact component={Pages} />
      <Route path="/pages/:slug" exact component={FormEditPage} />
      <Route path="/preview/:slug" exact component={PreviewPage} />
      <Route path="/create-page" exact component={CreatePage} />
    </Switch>
  );
};
