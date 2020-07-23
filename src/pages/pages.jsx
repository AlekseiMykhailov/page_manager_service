import React, { useState, useEffect } from 'react';
import { getData } from '../helpers';
import { Layout } from '../components/Layout';
import { List } from '../components/List';
import { Spinner } from '../components/Spinner';

export const Pages = () => {
  const [pagesList, setPagesList] = useState([]);

  useEffect(() => {
    if (pagesList.length === 0) {
      getData('http://localhost:3010/api/pages').then(res => setPagesList(res.pages));
    }
  }, [pagesList.length]);

  return (
    <Layout title="Web Pages">
      <>
        {(pagesList.length === 0) && <Spinner />}
        {(pagesList.length > 0) && (
          <>
            <h1>Web Pages</h1>
            <List list={pagesList} section='pages' />
          </>
        )}
      </>
    </Layout>
  );
};
