
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import VerifyInfo from "./pages/VerifyInfo";
import Trending from "./pages/Trending";
import Predictions from "./pages/Predictions";
import ReportInsights from "./pages/ReportInsights";
import Pricing from "./pages/Pricing";
import ApiOrganizations from "./pages/ApiOrganizations";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
