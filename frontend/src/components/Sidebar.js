import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  UserGroupIcon, 
  BookOpenIcon, 
  CalculatorIcon, 
  DocumentTextIcon 
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { 
      name: 'Campaigns', 
      path: '/', 
      icon: BookOpenIcon 
    },
    { 
      name: 'Characters', 
      path: '/characters', 
      icon: UserGroupIcon 
    },
    { 
      name: 'Monsters', 
      path: '/monsters', 
      icon: CalculatorIcon 
    },
    { 
      name: 'Dice Roller', 
      path: '/dice', 
      icon: CalculatorIcon 
    },
    { 
      name: 'Session Notes', 
      path: '/sessions', 
      icon: DocumentTextIcon 
    }
  ];

  return (
    <aside className="w-64 bg-white border-r shadow-md">
      <div className="p-5">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          D&D Companion
        </h1>
        <nav>
          {menuItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path}
              className={`
                flex items-center p-3 rounded-md transition-colors duration-200
                ${location.pathname === item.path 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-100'}
              `}
            >
              <item.icon className="w-6 h-6 mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
