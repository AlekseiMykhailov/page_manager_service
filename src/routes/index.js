import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Dashboard, PageList, PageCreate, PageEdit, PagePreview } from '../pages';

export const Routes = () => {
  return (
    <Switch>
      <Route path="/" exact component={Dashboard} />
      <Route path="/pages" exact component={PageList} />
      <Route path="/pages/:slug" exact component={PageEdit} />
      <Route path="/preview/:slug" exact component={PagePreview} />
      <Route path="/create-page" exact component={PageCreate} />
    </Switch>
  );
};
