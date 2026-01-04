
// src/router.tsx
import { createBrowserRouter } from "react-router-dom";

import Login from "@/components/Login";
import Signup from "@/components/Signup";
import ResetPassword from "@/pages/ResetPassword";
import AdminSetup from "@/pages/AdminSetup";
import Dashboard from "@/components/DashboardUser";
import AdminDashboard from "@/pages/AdminDashboard";
import Contact from "@/pages/Contact";
import ApiRequest from "@/components/ApiRequestForm";
import Prediction from "@/components/PredictionForm";
import Newsletter from "@/components/NewsletterForm";
import HelpCenter from "@/pages/HelpCenter";
import NotFound from "@/pages/NotFound";
import Index from "@/pages/Index";
import RequireAuth from "@/components/auth/RequireAuth";
import RequireAdmin from "@/components/auth/RequireAdmin";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/admin-setup",
    element: <AdminSetup />,
  },
  {
    path: "/dashboard",
    element: <RequireAuth><Dashboard /></RequireAuth>,
  },
  {
    path: "/admin",
    element: <RequireAuth><RequireAdmin><AdminDashboard /></RequireAdmin></RequireAuth>,
  },
  {
    path: "/contact",
    element: <RequireAuth><Contact /></RequireAuth>,
  },
  {
    path: "/api-request",
    element: <RequireAuth><ApiRequest /></RequireAuth>,
  },
  {
    path: "/prediction",
    element: <RequireAuth><Prediction /></RequireAuth>,
  },
  {
    path: "/newsletter",
    element: <RequireAuth><Newsletter /></RequireAuth>,
  },
  {
    path: "/help-center",
    element: <HelpCenter />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
