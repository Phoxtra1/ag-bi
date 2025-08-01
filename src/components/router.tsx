
// src/router.tsx
import { createBrowserRouter } from "react-router-dom";

import Login from "@/components/Login";
import Signup from "@/components/Signup";
import Dashboard from "@/components/DashboardUser";
import Contact from "@/components/ContactForm";
import ApiRequest from "@/components/ApiRequestForm";
import Prediction from "@/components/PredictionForm";
import Newsletter from "@/components/NewsletterForm";

// Import pages
import Index from "@/pages/Index";
import About from "@/pages/About";
import Pricing from "@/pages/Pricing";
import Help from "@/pages/Help";
import VerifyInfo from "@/pages/VerifyInfo";
import ApiOrganizations from "@/pages/ApiOrganizations";
import Predictions from "@/pages/Predictions";

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
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/api-request",
    element: <ApiRequest />,
  },
  {
    path: "/api-organizations",
    element: <ApiOrganizations />,
  },
  {
    path: "/prediction",
    element: <Prediction />,
  },
  {
    path: "/predictions",
    element: <Predictions />,
  },
  {
    path: "/newsletter",
    element: <Newsletter />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/pricing",
    element: <Pricing />,
  },
  {
    path: "/help",
    element: <Help />,
  },
  {
    path: "/verify",
    element: <VerifyInfo />,
  },
]);

export default router;
