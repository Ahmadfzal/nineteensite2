import { useState, useRef } from "react";
import AdminLayout from "@/components/layouts/admin-layout";
import { useAdminGuard } from "@/hooks/use-admin";
import {
  useListProducts, useListCategories, useCreateProduct,
  useUpdateProduct, useDeleteProduct,
  getListProductsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Plus, Pencil, Trash2, Package, Loader2, X,
  Globe, Search, ImagePlus, Tag
} from "lucide-react";
import { formatCurrency, resolveImageUrl } from "@/lib/utils";
import type { Product } from "@workspace/api-client-react";

type FormData = {
  name: string;
  price: string;
  discountEnabled: boolean;
  discount: string;
  description: string;
  categoryId: string;
  images: string[];
  features: string;
  whatsappNumber: string;
  status: "active" | "inactive";
};

const emptyForm: FormData = {
  name: "", price: "", discountEnabled: false, discount: "",
  description: "", categoryId: "",
  images: [], features: "", whatsappNumber: "", status: "active",
};

function toFormData(p: Product): FormData {
  return {
    name: p.name, price: String(p.price),
    discountEnabled: p.discount != null,
    discount: p.discount != null ? String(p.discount) : "",
    description: p.description,
    categoryId: p.categoryId ? String(p.categoryId) : "",
    images: p.images ?? [],
    features: p.features?.join("\n") ?? "",
    whatsappNumber: p.whatsappNumber,
    status: p.status as "active" | "inactive",
  };
}

export default function AdminProductsPage() {
  const { isLoading: authLoading, isAuthenticated } = useAdminGuard();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const { data: products, isLoading } = useListProducts(
    { search: search || undefined },
    { query: { enabled: isAuthenticated } }
  );
  const { data: categories } = useListCategories({ query: { enabled: isAuthenticated } });

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });

  const create = useCreateProduct({ mutation: { onSuccess: () => { invalidate(); closeForm(); } } });
  const update = useUpdateProduct({ mutation: { onSuccess: () => { invalidate(); closeForm(); } } });
  const del = useDeleteProduct({ mutation: { onSuccess: () => { invalidate(); setDeletingId(null); } } });

  const openAdd = () => { setEditingProduct(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (p: Product) => { setEditingProduct(p); setForm(toFormData(p)); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditingProduct(null); setForm(emptyForm); setUploadError(null); };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadingImage(true);
    setUploadError(null);
    const newPaths: string[] = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/storage/upload", { method: "POST", body: fd, credentials: "include" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Upload gagal" }));
        setUploadError((err as { error: string }).error || "Upload gagal");
        setUploadingImage(false);
        return;
      }
      const data = await res.json() as { objectPath: string };
      newPaths.push(data.objectPath);
    }
    setForm((prev) => ({ ...prev, images: [...prev.images, ...newPaths] }));
    setUploadingImage(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (idx: number) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      price: Number(form.price),
      discount: form.discountEnabled && form.discount ? Number(form.discount) : null,
      description: form.description,
      categoryId: form.categoryId ? Number(form.categoryId) : null,
      images: form.images,
      features: form.features.split("\n").map((s) => s.trim()).filter(Boolean),
      whatsappNumber: form.whatsappNumber,
      status: form.status,
    };
    if (editingProduct) {
      update.mutate({ id: editingProduct.id, data: payload });
    } else {
      create.mutate({ data: payload });
    }
  };

  const f = (k: keyof FormData, v: string) => setForm((prev) => ({ ...prev, [k]: v }));
  const toggleDiscount = () => setForm((prev) => ({ ...prev, discountEnabled: !prev.discountEnabled, discount: prev.discountEnabled ? "" : prev.discount }));

  if (authLoading) {
    return (
      <AdminLayout title="Produk">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Produk">
      <div className="max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Produk Website</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{products?.length ?? 0} produk</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Cari produk..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 border border-border rounded-lg text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> Tambah Produk
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : products?.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Belum ada produk. Tambahkan produk pertama!</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Produk</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Kategori</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">Harga</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {products?.map((p, i) => {
                    const img = resolveImageUrl(p.images?.[0]);
                    return (
                      <tr key={p.id} className={`border-b border-border last:border-0 ${i % 2 === 1 ? "bg-muted/20" : ""}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-8 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                              {img ? (
                                <img src={img} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Globe className="w-4 h-4 text-muted-foreground/50" />
                                </div>
                              )}
                            </div>
                            <span className="font-medium text-foreground line-clamp-1">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{p.categoryName || "-"}</td>
                        <td className="px-4 py-3 text-right font-medium text-foreground">{formatCurrency(p.price)}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openEdit(p)}
                              className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            {deletingId === p.id ? (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => del.mutate({ id: p.id })}
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
                                onClick={() => setDeletingId(p.id)}
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
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-semibold text-foreground">
                {editingProduct ? "Edit Produk" : "Tambah Produk"}
              </h3>
              <button onClick={closeForm} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1">Nama Produk</label>
                  <input
                    required value={form.name} onChange={(e) => f("name", e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Nama website..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Harga (IDR)</label>
                  <input
                    required type="number" min="0" value={form.price} onChange={(e) => f("price", e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="150000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Diskon</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={toggleDiscount}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none ${form.discountEnabled ? "bg-primary" : "bg-muted"}`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform ${form.discountEnabled ? "translate-x-5" : "translate-x-0"}`}
                      />
                    </button>
                    {form.discountEnabled && (
                      <div className="flex items-center flex-1 gap-1">
                        <input
                          type="number" min="1" max="100"
                          value={form.discount} onChange={(e) => f("discount", e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                          placeholder="10"
                        />
                        <span className="flex items-center gap-1 text-sm font-medium text-muted-foreground whitespace-nowrap">
                          <Tag className="w-3.5 h-3.5" /> %
                        </span>
                      </div>
                    )}
                    {!form.discountEnabled && (
                      <span className="text-sm text-muted-foreground">Tidak ada diskon</span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Kategori</label>
                  <select
                    value={form.categoryId} onChange={(e) => f("categoryId", e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Tanpa Kategori</option>
                    {categories?.map((c) => (
                      <option key={c.id} value={String(c.id)}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Status</label>
                  <select
                    value={form.status} onChange={(e) => f("status", e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Tidak Aktif</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1">Deskripsi</label>
                  <textarea
                    required value={form.description} onChange={(e) => f("description", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    placeholder="Deskripsi singkat produk..."
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1">Nomor WhatsApp</label>
                  <input
                    required value={form.whatsappNumber} onChange={(e) => f("whatsappNumber", e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="628123456789"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1">Gambar Produk</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleImageUpload(e.target.files)}
                  />
                  {form.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {form.images.map((img, idx) => (
                        <div key={idx} className="relative group w-20 h-16 rounded-lg overflow-hidden border border-border bg-muted flex-shrink-0">
                          <img
                            src={resolveImageUrl(img)}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                          >
                            <X className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="flex items-center gap-2 px-3 py-2 border border-dashed border-border rounded-lg text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
                  >
                    {uploadingImage ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Mengupload...</>
                    ) : (
                      <><ImagePlus className="w-4 h-4" /> Tambah Gambar</>
                    )}
                  </button>
                  {uploadError && (
                    <p className="text-xs text-destructive mt-1">{uploadError}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Fitur <span className="text-muted-foreground font-normal">(satu per baris)</span>
                  </label>
                  <textarea
                    value={form.features} onChange={(e) => f("features", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    placeholder="Desain responsif&#10;SEO friendly&#10;Domain gratis 1 tahun"
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
                    editingProduct ? "Simpan Perubahan" : "Tambah Produk"
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
