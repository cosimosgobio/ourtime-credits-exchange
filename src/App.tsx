import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Pages
import Index from "./pages/Index";
import EarnCredits from "./pages/EarnCredits";
import UseCredits from "./pages/UseCredits";
import Profile from "./pages/Profile";
import ActivityDetail from "./pages/ActivityDetail";
import CreateActivity from "./pages/CreateActivity";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/earn" element={<EarnCredits />} />
          <Route path="/use" element={<UseCredits />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create" element={<CreateActivity />} />
          <Route path="/activity/:id" element={<ActivityDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
