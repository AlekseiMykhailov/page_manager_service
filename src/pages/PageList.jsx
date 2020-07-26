import React, { useEffect, useState } from 'react';
import { List } from '../components/List';
import { Spinner } from '../components/Spinner';
import { getData } from '../helpers';
import { Layout } from '../layouts';

export const PageList = () => {
  const [pagesList, setPagesList] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    getData(`${API_URL}/pages`).then(res => setPagesList(res.pages));
  }, [API_URL]);

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
