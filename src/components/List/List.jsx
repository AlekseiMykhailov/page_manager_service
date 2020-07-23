import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './List.scss';

export const List = ({ list, section }) => {
  const { pathname } = useLocation();

  const createPath = (section, path, slug) => {
    const sectionPart = section ? `/${section}` : '';
    const pathPart = path ? `${path}` : '';
    const slugPart = slug ? `/${slug}` : '';

    return sectionPart + pathPart + slugPart;
  };

  return (
    <ul className="List">
      {list && list.map(item => {
        if (pathname === item.path) {
          return '';
        }

        return (
          <li className="List__Item" key={item.id}>
            <Link
              className="List__Link"
              to={createPath(section, item.path, item.slug)}
            >
              {item.title}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
