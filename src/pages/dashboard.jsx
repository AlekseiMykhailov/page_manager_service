import React, { useState, useEffect } from 'react';
import { getData } from '../helpers';
import { Layout } from '../components/Layout';
import { List } from '../components/List';
import { Spinner } from '../components/Spinner';

export const Dashboard = () => {
  const [sections, setSections] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (sections.length === 0) {
      getData(`${API_URL}/api/nav`).then(res => setSections(res.nav));
    }
  }, [sections.length, API_URL]);

  return (
    <Layout title="Dashboard">
      <>
        {(sections.length === 0) && <Spinner />}
        {(sections.length > 0) && (
          <>
            <h1>Dashboard</h1>
            <List list={sections} />
          </>
        )}
      </>
    </Layout>
  );
};
