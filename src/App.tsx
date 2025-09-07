
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDataSync from "@/components/admin/AdminDataSync";

// Pages & Components
import Login from "@/components/Login";
import Signup from "@/components/Signup";
import Index from "./pages/Index";
import VerifyInfo from "./pages/VerifyInfo";
import Trending from "./pages/Trending";
import Predictions from "./pages/Predictions";
import ReportInsights from "./pages/ReportInsights";
import Pricing from "./pages/Pricing";
import ApiOrganizations from "./pages/ApiOrganizations";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Amnewsworld from "./pages/Amnewsworld";
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

// ✅ Import centralized Odeneho AI assistant
import OdenehoComponent from "@/components/OdenehoComponent";
import RequireAuth from "@/components/auth/RequireAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AdminDataSync />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes */}
          <Route path="/verify" element={<RequireAuth><VerifyInfo /></RequireAuth>} />
          <Route path="/trending" element={<RequireAuth><Trending /></RequireAuth>} />
          <Route path="/predictions" element={<RequireAuth><Predictions /></RequireAuth>} />
          <Route path="/reports" element={<RequireAuth><ReportInsights /></RequireAuth>} />
          <Route path="/pricing" element={<RequireAuth><Pricing /></RequireAuth>} />
          <Route path="/api-organizations" element={<RequireAuth><ApiOrganizations /></RequireAuth>} />
          <Route path="/dashboard" element={<RequireAuth><UserDashboard /></RequireAuth>} />
          <Route path="/admin" element={<RequireAuth><AdminDashboard /></RequireAuth>} />

          {/* Other routes (optional to protect later) */}
          <Route path="/amnewsworld" element={<Amnewsworld />} />
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

        {/* ✅ Persistent centralized Odeneho chatbot */}
        <OdenehoComponent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
