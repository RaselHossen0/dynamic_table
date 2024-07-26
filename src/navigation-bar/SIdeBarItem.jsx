import React from 'react';
import classNames from 'classnames';

const SidebarNavItem = ({ index, activeIndex, onClick, icon, name }) => {
  return (
    <li>
      <button
        onClick={() => onClick(index)}
        className={classNames('inline-flex items-center px-4 py-3 rounded-lg w-full', {
          'text-white bg-primary-g3 ': activeIndex === index,
          'hover:text-gray-900 bg-sidebar-default hover:bg-sidebar-primary-hover dark:bg-sidebar-dark dark:hover:bg-sidebar-primary-dark dark:hover:text-white': activeIndex !== index
        })}
      >
        <svg
          className="w-4 h-4 me-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d={icon} />
        </svg>
        {name}
      </button>
    </li>
  );
};

export default SidebarNavItem;
