
// src/router.tsx
import { createBrowserRouter } from "react-router-dom";

import Login from "@/components/Login";
import Signup from "@/components/Signup";
import Dashboard from "@/components/DashboardUser";
import Contact from "@/components/ContactForm";
import ApiRequest from "@/components/ApiRequestForm";
import Prediction from "@/components/PredictionForm";
import Newsletter from "@/components/NewsletterForm";
import HelpCenter from "@/pages/HelpCenter";
import NotFound from "@/pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
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
    path: "/prediction",
    element: <Prediction />,
  },
  {
    path: "/newsletter",
    element: <Newsletter />,
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
