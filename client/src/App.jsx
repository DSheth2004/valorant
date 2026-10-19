import { lazy } from "react";
import { Route, Routes } from "react-router";
import { Layout } from "./components/layout/Layout";
import { RequireAuth } from "./components/RequireAuth";

// Each page is its own chunk, so the first load only ships what the landing page needs.
const HomePage = lazy(() => import("./pages/HomePage"));
const AgentsPage = lazy(() => import("./pages/AgentsPage"));
const MapsPage = lazy(() => import("./pages/MapsPage"));
const ArsenalPage = lazy(() => import("./pages/ArsenalPage"));
const StorePage = lazy(() => import("./pages/StorePage"));
const SpecsPage = lazy(() => import("./pages/SpecsPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="agents" element={<AgentsPage />} />
        <Route path="maps" element={<MapsPage />} />
        <Route path="arsenal" element={<ArsenalPage />} />
        <Route path="store" element={<StorePage />} />
        <Route path="specs" element={<SpecsPage />} />
        <Route path="login" element={<AuthPage />} />
        <Route
          path="profile"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
