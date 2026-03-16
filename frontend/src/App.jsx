import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import { ProgressProvider, useProgress } from "./context/ProgressContext";
import { useAuth } from "./context/AuthContext";

import Header from "./components/layout/Header";
import Container from "./components/layout/Container";
import BottomNav from "./components/layout/BottomNav";
import ProgressBar from "./components/ui/ProgressBar";
import AuthLoading from "./components/ui/AuthLoading";

import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";
import ReportPage from "./pages/ReportPage";
import MatchesPage from "./pages/MatchesPage";
import SuccessPage from "./pages/SuccessPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";

import ProtectedRoute from "./pages/ProtectedRoute";
import PublicRoute from "./pages/PublicRoute";

// Dispara la barra en cada cambio de ruta
function NavigationProgress() {
  const location = useLocation();
  const { start, done } = useProgress();

  useEffect(() => {
    start();
    const timer = setTimeout(done, 500);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return null;
}

function AppContent() {
  const { authLoading } = useAuth();

  if (authLoading) return <AuthLoading />;

  return (
    <>
      <ProgressBar />
      <NavigationProgress />
      <Header />
      <Container>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <AuthPage />
              </PublicRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report"
            element={
              <ProtectedRoute>
                <ReportPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/matches"
            element={
              <ProtectedRoute>
                <MatchesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/success"
            element={
              <ProtectedRoute>
                <SuccessPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Container>
      <BottomNav />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ProgressProvider>
        <AppContent />
      </ProgressProvider>
    </BrowserRouter>
  );
}

export default App;