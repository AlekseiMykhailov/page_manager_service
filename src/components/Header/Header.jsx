import React from 'react';
import { useLocation } from 'react-router-dom';
import { NavContainer } from '../../containers/NavContainer';
import './Header.scss';

export const Header = () => {
  const { pathname } = useLocation();

  return (
    <header className="Header">
      <div className="Header__Container container">
        {pathname !== '/' && <NavContainer />}
      </div>
    </header>
  );
};
