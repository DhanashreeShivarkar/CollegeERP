import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface MenuItem {
  title: string;
  path: string;
  icon: string;
  submenu?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: "📊",
  },
  {
    title: "Academic",
    path: "/academic",
    icon: "🎓",
    submenu: [
      { title: "Programs", path: "/academic/programs", icon: "📚" },
      { title: "Courses", path: "/academic/courses", icon: "📖" },
      { title: "Schedule", path: "/academic/schedule", icon: "📅" },
    ],
  },
  {
    title: "Students",
    path: "/students",
    icon: "👨‍🎓",
    submenu: [
      { title: "All Students", path: "/students/all", icon: "👥" },
      { title: "Admissions", path: "/students/admissions", icon: "📝" },
      { title: "Attendance", path: "/students/attendance", icon: "✅" },
    ],
  },
  {
    title: "Faculty",
    path: "/faculty",
    icon: "👨‍🏫",
    submenu: [
      { title: "All Faculty", path: "/faculty/all", icon: "👥" },
      { title: "Departments", path: "/faculty/departments", icon: "🏢" },
    ],
  },
  {
    title: "Examination",
    path: "/examination",
    icon: "📝",
    submenu: [
      { title: "Exam Schedule", path: "/examination/schedule", icon: "📅" },
      { title: "Results", path: "/examination/results", icon: "📊" },
    ],
  },
  {
    title: "Finance",
    path: "/finance",
    icon: "💰",
    submenu: [
      { title: "Fees", path: "/finance/fees", icon: "💵" },
      { title: "Payments", path: "/finance/payments", icon: "💳" },
    ],
  },
];

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const location = useLocation();

  const toggleSubmenu = (path: string) => {
    setOpenMenus((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  };

  const isActive = (path: string) => location.pathname === path;
  const isSubmenuOpen = (path: string) => openMenus.includes(path);

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen px-4 py-6">
      <div className="flex items-center mb-8 px-2">
        <img src="/logo.svg" alt="Synchronik ERP" className="h-8 w-8 mr-2" />
        <span className="text-xl font-bold">Synchronik ERP</span>
      </div>

      <nav>
        {menuItems.map((item) => (
          <div key={item.path} className="mb-2">
            <button
              onClick={() => item.submenu && toggleSubmenu(item.path)}
              className={`w-full flex items-center justify-between px-2 py-2 rounded-md transition-colors ${
                isActive(item.path) ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
            >
              <div className="flex items-center">
                <span className="mr-2">{item.icon}</span>
                <span>{item.title}</span>
              </div>
              {item.submenu && (
                <svg
                  className={`w-4 h-4 transition-transform ${
                    isSubmenuOpen(item.path) ? "transform rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              )}
            </button>

            {item.submenu && isSubmenuOpen(item.path) && (
              <div className="ml-4 mt-2 space-y-1">
                {item.submenu.map((subItem) => (
                  <Link
                    key={subItem.path}
                    to={subItem.path}
                    className={`flex items-center px-2 py-2 rounded-md transition-colors ${
                      isActive(subItem.path)
                        ? "bg-blue-600"
                        : "hover:bg-gray-700"
                    }`}
                  >
                    <span className="mr-2">{subItem.icon}</span>
                    <span>{subItem.title}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
