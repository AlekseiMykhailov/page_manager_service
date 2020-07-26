import React, { useState, useEffect } from 'react';
import { getData } from '../helpers';
import { Nav } from '../components/Nav';

export const NavContainer = () => {
  const [navList, setNavList] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    getData(`${API_URL}/nav`)
      .then(res => setNavList(res.nav));
  }, [API_URL]);

  return (
    <>
      {(navList.length > 0) && <Nav navList={navList} />}
    </>
  );
};
