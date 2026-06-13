import AdminLayout from "@/components/layouts/admin-layout";
import { useAdminGuard } from "@/hooks/use-admin";
import { useGetDashboardStats } from "@workspace/api-client-react";
import { Package, Users, TrendingUp, AlertTriangle, Loader2 } from "lucide-react";

export default function AdminDashboardPage() {
  const { isLoading: authLoading, isAuthenticated } = useAdminGuard();
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats({
    query: { enabled: isAuthenticated },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Produk",
      value: stats?.totalProducts ?? 0,
      sub: "website terdaftar",
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Total Klien",
      value: stats?.totalClients ?? 0,
      sub: `${stats?.activeClients ?? 0} aktif`,
      icon: Users,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Segera Kedaluwarsa",
      value: stats?.expiringClients ?? 0,
      sub: "dalam 7 hari",
      icon: AlertTriangle,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="max-w-5xl">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground">Selamat Datang!</h2>
          <p className="text-muted-foreground mt-1">
            Ringkasan data marketplace website Anda.
          </p>
        </div>

        {statsLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground py-10">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Memuat statistik...</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {statCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.label} className="bg-card border border-border rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-muted-foreground">{card.label}</span>
                      <div className={`w-9 h-9 rounded-xl ${card.bg} flex items-center justify-center`}>
                        <Icon className={`w-4.5 h-4.5 ${card.color}`} />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-foreground">{card.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
                  </div>
                );
              })}
            </div>

            {/* Quick insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-foreground">Status Klien</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Klien Aktif</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{
                            width: stats?.totalClients
                              ? `${(stats.activeClients / stats.totalClients) * 100}%`
                              : "0%",
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-foreground w-8 text-right">
                        {stats?.activeClients ?? 0}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Segera Kedaluwarsa</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-400 rounded-full"
                          style={{
                            width: stats?.activeClients
                              ? `${(stats.expiringClients / stats.activeClients) * 100}%`
                              : "0%",
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-foreground w-8 text-right">
                        {stats?.expiringClients ?? 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
