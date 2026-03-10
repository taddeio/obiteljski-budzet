import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  PieChart,
  Plus,
  Target,
  Menu,
} from "lucide-react";
import { Modal } from "../ui/Modal";

export const BottomNav: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const navItems = [
    {
      path: "/",
      label: "Početna",
      icon: LayoutDashboard,
    },
    {
      path: "/budget",
      label: "Budžet",
      icon: PieChart,
    },
    {
      path: "/goals",
      label: "Ciljevi",
      icon: Target,
    },
    {
      path: "/settings",
      label: "Više",
      icon: Menu,
    },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 safe-area-inset-bottom">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-1 flex-col items-center justify-center py-3 px-2 text-xs font-medium transition-colors ${
                    isActive
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`
                }
              >
                <Icon size={24} className="mb-1" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          {/* Center Add Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={28} />
          </button>
        </div>
      </nav>

      {/* Add Transaction Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Dodaj transakciju"
      >
        <div className="text-center text-gray-500 py-8">
          <p>Dodavanje transakcija će biti dostupno uskoro.</p>
        </div>
      </Modal>
    </>
  );
};
