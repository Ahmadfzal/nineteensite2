import { useState } from "react";
import AdminLayout from "@/components/layouts/admin-layout";
import { useAdminGuard } from "@/hooks/use-admin";
import {
  useListCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  getListCategoriesQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Plus, Pencil, Trash2, Tag, Loader2, X, Check
} from "lucide-react";
import type { Category } from "@workspace/api-client-react";

export default function AdminCategoriesPage() {
  const { isLoading: authLoading, isAuthenticated } = useAdminGuard();
  const queryClient = useQueryClient();
  const { data: categories, isLoading } = useListCategories({
    query: { enabled: isAuthenticated },
  });

  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: getListCategoriesQueryKey() });

  const create = useCreateCategory({ mutation: { onSuccess: () => { invalidate(); setShowAdd(false); setNewName(""); } } });
  const update = useUpdateCategory({ mutation: { onSuccess: () => { invalidate(); setEditingId(null); } } });
  const del = useDeleteCategory({ mutation: { onSuccess: () => { invalidate(); setDeletingId(null); } } });

  if (authLoading || isLoading) {
    return (
      <AdminLayout title="Kategori">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Kategori">
      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Kategori Website</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{categories?.length ?? 0} kategori</p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" /> Tambah Kategori
          </button>
        </div>

        {/* Add form */}
        {showAdd && (
          <div className="bg-card border border-primary/30 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Nama kategori baru..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") create.mutate({ data: { name: newName } }); }}
                className="flex-1 px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                autoFocus
              />
              <button
                onClick={() => create.mutate({ data: { name: newName } })}
                disabled={!newName.trim() || create.isPending}
                className="p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50"
              >
                {create.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              </button>
              <button
                onClick={() => { setShowAdd(false); setNewName(""); }}
                className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* List */}
        <div className="space-y-2">
          {categories?.length === 0 && (
            <div className="bg-card border border-border rounded-xl p-10 text-center">
              <Tag className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Belum ada kategori. Tambahkan kategori pertama!</p>
            </div>
          )}

          {categories?.map((cat) => (
            <div key={cat.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                <Tag className="w-4 h-4 text-accent-foreground" />
              </div>

              {editingId === cat.id ? (
                <>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") update.mutate({ id: cat.id, data: { name: editName } });
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    className="flex-1 px-3 py-1.5 border border-border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    autoFocus
                  />
                  <button
                    onClick={() => update.mutate({ id: cat.id, data: { name: editName } })}
                    disabled={!editName.trim() || update.isPending}
                    className="p-1.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50"
                  >
                    {update.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1 font-medium text-foreground">{cat.name}</span>
                  <button
                    onClick={() => { setEditingId(cat.id); setEditName(cat.name); }}
                    className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  {deletingId === cat.id ? (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-destructive">Hapus?</span>
                      <button
                        onClick={() => del.mutate({ id: cat.id })}
                        disabled={del.isPending}
                        className="p-1.5 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 disabled:opacity-50"
                      >
                        {del.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                      </button>
                      <button
                        onClick={() => setDeletingId(null)}
                        className="p-1.5 text-muted-foreground rounded-lg hover:bg-muted"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeletingId(cat.id)}
                      className="p-1.5 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
