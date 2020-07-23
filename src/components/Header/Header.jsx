import React from 'react';
import { useLocation } from 'react-router-dom';
import { Nav } from '../Nav';
import './Header.scss';

export const Header = () => {
  const { pathname } = useLocation();

  return (
    <header className="Header">
      <div className="Header__Container container">
        {pathname !== '/' && <Nav />}
      </div>
    </header>
  );
};
