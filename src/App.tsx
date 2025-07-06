
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDataSync from "@/components/admin/AdminDataSync";
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
          <Route path="/verify" element={<VerifyInfo />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/predictions" element={<Predictions />} />
          <Route path="/reports" element={<ReportInsights />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/api-organizations" element={<ApiOrganizations />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
