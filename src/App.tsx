import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDataSync from "@/components/admin/AdminDataSync";

// Pages & Components
import Login from "@/components/Login";
import Signup from "@/components/Signup";
import AdminSetup from "@/pages/AdminSetup";
import Index from "./pages/Index";
import VerifyInfo from "./pages/VerifyInfo";
import Trending from "./pages/Trending";
import Predictions from "./pages/Predictions";
import ReportInsights from "./pages/ReportInsights";
import Reports from "./pages/Reports";
import Explore from "./pages/Explore";
import Pricing from "./pages/Pricing";
import ApiOrganizations from "./pages/ApiOrganizations";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import About from "./pages/About";
import Careers from "./pages/Careers";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import FAQ from "./pages/FAQ";
import Help from "./pages/Help";
import Contact from "./pages/Contact";
import Newsletter from "./pages/Newsletter";
import WatchDemo from "./pages/WatchDemo";

import NotFound from "./pages/NotFound";

// ✅ Import centralized Dipa assistant
import RequireAuth from "@/components/auth/RequireAuth";
import RequireAdmin from "@/components/auth/RequireAdmin";
import PageLoader from "@/components/PageLoader";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PageLoader>
        <Toaster />
        <Sonner />
        <AdminDataSync />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin-setup" element={<AdminSetup />} />

          {/* Protected routes */}
          <Route path="/verify" element={<RequireAuth><VerifyInfo /></RequireAuth>} />
          <Route path="/trending" element={<RequireAuth><Trending /></RequireAuth>} />
          <Route path="/predictions" element={<RequireAuth><Predictions /></RequireAuth>} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/reports/insights" element={<RequireAuth><ReportInsights /></RequireAuth>} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/api-organizations" element={<RequireAuth><ApiOrganizations /></RequireAuth>} />
          <Route path="/dashboard" element={<RequireAuth><UserDashboard /></RequireAuth>} />
          
          {/* Admin route - temporarily open for development */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Other routes (optional to protect later) */}
          
          <Route path="/about" element={<About />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/help" element={<Help />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/newsletter" element={<Newsletter />} />
          <Route path="/watch-demo" element={<WatchDemo />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>

      </BrowserRouter>
      </PageLoader>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
