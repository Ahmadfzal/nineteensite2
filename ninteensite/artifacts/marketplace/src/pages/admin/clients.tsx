import { useState } from "react";
import AdminLayout from "@/components/layouts/admin-layout";
import { useAdminGuard } from "@/hooks/use-admin";
import {
  useListClients, useCreateClient, useUpdateClient, useDeleteClient,
  useExtendClient, useToggleClientStatus,
  getListClientsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Plus, Pencil, Trash2, Users, Loader2, X,
  RefreshCw, ToggleLeft, ToggleRight, ExternalLink, AlertTriangle
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { ClientWebsite } from "@workspace/api-client-react";

type FormData = {
  websiteName: string;
  websiteId: string;
  url: string;
  status: "active" | "inactive";
  startDate: string;
  endDate: string;
};

const today = () => new Date().toISOString().split("T")[0];
const thirtyDaysLater = () => {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().split("T")[0];
};

const emptyForm: FormData = {
  websiteName: "", websiteId: "", url: "",
  status: "active", startDate: today(), endDate: thirtyDaysLater(),
};

function toFormData(c: ClientWebsite): FormData {
  return {
    websiteName: c.websiteName, websiteId: c.websiteId, url: c.url,
    status: c.status as "active" | "inactive",
    startDate: c.startDate?.split("T")[0] ?? today(),
    endDate: c.endDate?.split("T")[0] ?? thirtyDaysLater(),
  };
}

export default function AdminClientsPage() {
  const { isLoading: authLoading, isAuthenticated } = useAdminGuard();
  const queryClient = useQueryClient();
  const { data: clients, isLoading } = useListClients({ query: { enabled: isAuthenticated } });

  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientWebsite | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: getListClientsQueryKey() });

  const create = useCreateClient({ mutation: { onSuccess: () => { invalidate(); closeForm(); } } });
  const update = useUpdateClient({ mutation: { onSuccess: () => { invalidate(); closeForm(); } } });
  const del = useDeleteClient({ mutation: { onSuccess: () => { invalidate(); setDeletingId(null); } } });
  const extend = useExtendClient({ mutation: { onSuccess: invalidate } });
  const toggle = useToggleClientStatus({ mutation: { onSuccess: invalidate } });

  const openAdd = () => { setEditingClient(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (c: ClientWebsite) => { setEditingClient(c); setForm(toFormData(c)); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditingClient(null); setForm(emptyForm); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      update.mutate({ id: editingClient.id, data: form });
    } else {
      create.mutate({ data: form });
    }
  };

  const f = (k: keyof FormData, v: string) => setForm((prev) => ({ ...prev, [k]: v }));

  if (authLoading) {
    return (
      <AdminLayout title="Klien">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Klien">
      <div className="max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Klien Website</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{clients?.length ?? 0} klien terdaftar</p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" /> Tambah Klien
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : clients?.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Belum ada klien. Tambahkan klien pertama!</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Website</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">ID</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Berakhir</th>
                    <th className="text-center px-4 py-3 font-medium text-muted-foreground">Sisa</th>
                    <th className="text-center px-4 py-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {clients?.map((c, i) => {
                    const days = c.daysRemaining ?? 0;
                    const expiring = days >= 0 && days <= 7;
                    const expired = days < 0;
                    return (
                      <tr key={c.id} className={`border-b border-border last:border-0 ${i % 2 === 1 ? "bg-muted/20" : ""}`}>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-foreground">{c.websiteName}</p>
                            <a href={c.url} target="_blank" rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline flex items-center gap-1">
                              {c.url} <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground font-mono">{c.websiteId}</td>
                        <td className="px-4 py-3 text-muted-foreground">{formatDate(c.endDate)}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`flex items-center justify-center gap-1 text-xs font-medium ${
                            expired ? "text-destructive" : expiring ? "text-orange-600" : "text-green-600"
                          }`}>
                            {(expiring || expired) && <AlertTriangle className="w-3 h-3" />}
                            {expired ? "Kedaluwarsa" : `${days}h`}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => toggle.mutate({ id: c.id })}
                            disabled={toggle.isPending}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                              c.status === "active"
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {c.status === "active"
                              ? <><ToggleRight className="w-3 h-3" /> Aktif</>
                              : <><ToggleLeft className="w-3 h-3" /> Non-Aktif</>
                            }
                          </button>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => extend.mutate({ id: c.id })}
                              disabled={extend.isPending}
                              title="Perpanjang 30 hari"
                              className="p-1.5 text-muted-foreground hover:text-primary rounded-lg hover:bg-primary/10"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openEdit(c)}
                              className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            {deletingId === c.id ? (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => del.mutate({ id: c.id })}
                                  disabled={del.isPending}
                                  className="px-2 py-1 bg-destructive text-destructive-foreground rounded text-xs hover:opacity-90 disabled:opacity-50"
                                >
                                  {del.isPending ? "..." : "Hapus"}
                                </button>
                                <button onClick={() => setDeletingId(null)} className="p-1.5 text-muted-foreground hover:bg-muted rounded-lg">
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeletingId(c.id)}
                                className="p-1.5 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Form Overlay */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto p-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-semibold text-foreground">
                {editingClient ? "Edit Klien" : "Tambah Klien"}
              </h3>
              <button onClick={closeForm} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Nama Website</label>
                <input
                  required value={form.websiteName} onChange={(e) => f("websiteName", e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Toko Online Budi"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">ID Website</label>
                  <input
                    required value={form.websiteId} onChange={(e) => f("websiteId", e.target.value.replace(/\D/g, ""))}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono"
                    placeholder="123456"
                    pattern="[0-9]+"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Status</label>
                  <select
                    value={form.status} onChange={(e) => f("status", e.target.value as "active" | "inactive")}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Non-Aktif</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">URL Website</label>
                <input
                  required value={form.url} onChange={(e) => f("url", e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="https://tokobudi.my.id"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Tanggal Mulai</label>
                  <input
                    required type="date" value={form.startDate} onChange={(e) => f("startDate", e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Tanggal Berakhir</label>
                  <input
                    required type="date" value={form.endDate} onChange={(e) => f("endDate", e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button" onClick={closeForm}
                  className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={create.isPending || update.isPending}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                >
                  {(create.isPending || update.isPending) ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</>
                  ) : (
                    editingClient ? "Simpan Perubahan" : "Tambah Klien"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
