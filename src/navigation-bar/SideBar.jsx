import React, { useEffect, useState } from 'react';
import SidebarNavItem from './SIdeBarItem';
import axios from 'axios';

import AddTables from '../tables/AddTables';

const Sidebar = () => {
 
  const [activeIndex, setActiveIndex] = useState(0);
 

  const components = [
    <AddTables />,
    <AddTables />,
    <AddTables />
  ];

  const handleTabClick = (index) => {
    setActiveIndex(index);
  };

  const navItems = [
    { icon: "M2 11h3v8H2zM6 4h3v15H6zM10 6h3v13h-3zM14 9h3v10h-3zM18 2h3v17h-3z", name: "Dashboard" },
    { icon: "M3 3h14v2H3zM3 7h14v2H3zM3 11h14v2H3zM3 15h14v2H3z", name: "Table" },
    { icon: "M5 3v4h10V3zM4 8H2v9h4V8zM14 8h-4v9h4zM18 8h-2v9h4V8z", name: "Analytics" }
  ];

  return (
    <div className="flex h-screen w-full">
      <div className="flex flex-col justify-center h-full bg-primary-g1">
  <ul className=" space-y-4 text-sm font-medium text-primary-g1 me-4 mb-4 md:mb-0  ml-2">
    {navItems.map((item, index) => (
      <SidebarNavItem
        key={index}
        index={index}
        activeIndex={activeIndex}
        onClick={handleTabClick}
        icon={item.icon}
        name={item.name}
      />
    ))}
  </ul>
</div>
      <div className="p-6 text-medium text-sidebar-text dark:text-sidebar-text_dark  w-11/12">
        {components[activeIndex]}
      </div>
    </div>
  );
};

export default Sidebar;
