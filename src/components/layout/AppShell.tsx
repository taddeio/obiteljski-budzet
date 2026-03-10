import React from "react";
import { BottomNav } from "./BottomNav";
import { useAppContext } from "../../context/AppContext";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { user, family } = useAppContext();

  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return "Dobro jutro";
    if (hour < 18) return "Dobar dan";
    return "Dobra večer";
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 safe-area-inset-top">
        <div className="max-w-6xl mx-auto px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                {getGreeting()}, {user?.displayName?.split(" ")[0] || "Korisniče"}
              </p>
              <h1 className="text-2xl font-bold text-gray-900">
                {family?.name || "Moja obitelj"}
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-5 py-4 pb-24">
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};
