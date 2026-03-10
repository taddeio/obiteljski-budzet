import { Routes, Route } from "react-router-dom";
import { LoadingScreen } from "./components/LoadingScreen";
import { AppShell } from "./components/layout/AppShell";
import { useAppContext } from "./context/AppContext";
import { AuthPage } from "./pages/Auth/AuthPage";
import { FamilySetupPage } from "./pages/FamilySetup/FamilySetupPage";
import { DashboardPage } from "./pages/Dashboard/DashboardPage";
import { BudgetPage } from "./pages/Budget/BudgetPage";
import { GoalsPage } from "./pages/Goals/GoalsPage";
import { SettingsPage } from "./pages/Settings/SettingsPage";

function App() {
  const { isLoading, isAuthenticated, hasFamilySetup } = useAppContext();

  // Show loading screen while initializing
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Show auth page if not authenticated
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // Show family setup page if no family is set up
  if (!hasFamilySetup) {
    return <FamilySetupPage />;
  }

  // Show main app with layout
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/budget" element={<BudgetPage />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </AppShell>
  );
}

export default App;
