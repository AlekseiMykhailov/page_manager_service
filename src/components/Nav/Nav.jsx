import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import './Nav.scss';

export const Nav = ({ navList }) => {
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

Nav.propTypes = {
  navList: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  })).isRequired,
};
