import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home";
import ProductDetailPage from "@/pages/product-detail";
import ClientLookupPage from "@/pages/client-lookup";
import AdminLoginPage from "@/pages/admin/login";
import AdminDashboardPage from "@/pages/admin/dashboard";
import AdminProductsPage from "@/pages/admin/products";
import AdminCategoriesPage from "@/pages/admin/categories";
import AdminClientsPage from "@/pages/admin/clients";
import AdminSettingsPage from "@/pages/admin/settings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/produk/:id" component={ProductDetailPage} />
      <Route path="/cek-website" component={ClientLookupPage} />
      <Route path="/n19-panel" component={AdminLoginPage} />
      <Route path="/n19-panel/dashboard" component={AdminDashboardPage} />
      <Route path="/n19-panel/produk" component={AdminProductsPage} />
      <Route path="/n19-panel/kategori" component={AdminCategoriesPage} />
      <Route path="/n19-panel/klien" component={AdminClientsPage} />
      <Route path="/n19-panel/pengaturan" component={AdminSettingsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
