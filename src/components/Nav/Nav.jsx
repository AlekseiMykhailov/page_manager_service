import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { getData } from '../../helpers';
import './Nav.scss';

export const Nav = () => {
  const [navList, setNavList] = useState([]);

  useEffect(() => {
    if (navList.length === 0) {
      getData('http://localhost:3010/api/nav')
        .then(res => setNavList(res.nav));
    }
  }, [navList.length]);

  return (
    <nav className="Nav">
      <ul className="Nav__List">
        {navList.map(navItem => (
          <li className="Nav__Item" key={navItem.id}>
            <NavLink
              to={navItem.path}
              exact
              className="Nav__Link"
              activeClassName="Nav__Link--active"
            >
              {navItem.title}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};
