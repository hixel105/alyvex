import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { PublicPage } from "@/pages/PublicPage";
import { OwnerLogin } from "@/pages/owner/OwnerLogin";
import { OwnerLayout } from "@/pages/owner/OwnerLayout";
import { OwnerDashboard } from "@/pages/owner/OwnerDashboard";
import { OwnerBots } from "@/pages/owner/OwnerBots";
import { OwnerBotStatus } from "@/pages/owner/OwnerBotStatus";
import { OwnerInvites } from "@/pages/owner/OwnerInvites";
import { OwnerPremium } from "@/pages/owner/OwnerPremium";
import { OwnerDiscord } from "@/pages/owner/OwnerDiscord";
import { OwnerContent } from "@/pages/owner/OwnerContent";
import { OwnerAnnouncements } from "@/pages/owner/OwnerAnnouncements";
import { OwnerStats } from "@/pages/owner/OwnerStats";
import { OwnerSettings } from "@/pages/owner/OwnerSettings";
import { OwnerLogs } from "@/pages/owner/OwnerLogs";
import { OwnerLinks } from "@/pages/owner/OwnerLinks";
import { OwnerSecurity } from "@/pages/owner/OwnerSecurity";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import type { ReactNode } from "react";

function ScrollToTop() {
  useScrollToTop();
  return null;
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-500">
        <div className="h-10 w-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/owner/login" replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<PublicPage />} />
        <Route path="/owner/login" element={<OwnerLogin />} />
        <Route
          path="/owner"
          element={
            <ProtectedRoute>
              <OwnerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<OwnerDashboard />} />
          <Route path="bots" element={<OwnerBots />} />
          <Route path="bot-status" element={<OwnerBotStatus />} />
          <Route path="invites" element={<OwnerInvites />} />
          <Route path="premium" element={<OwnerPremium />} />
          <Route path="discord" element={<OwnerDiscord />} />
          <Route path="content" element={<OwnerContent />} />
          <Route path="announcements" element={<OwnerAnnouncements />} />
          <Route path="stats" element={<OwnerStats />} />
          <Route path="settings" element={<OwnerSettings />} />
          <Route path="logs" element={<OwnerLogs />} />
          <Route path="links" element={<OwnerLinks />} />
          <Route path="security" element={<OwnerSecurity />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
