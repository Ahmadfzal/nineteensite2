import { useState, useEffect } from "react";
import AdminLayout from "@/components/layouts/admin-layout";
import { useAdminGuard } from "@/hooks/use-admin";
import { useGetSettings, useUpdateSettings } from "@workspace/api-client-react";
import { Loader2, Save, Settings } from "lucide-react";

export default function AdminSettingsPage() {
  const { isLoading: authLoading, isAuthenticated } = useAdminGuard();
  const { data: settings, isLoading } = useGetSettings({ query: { enabled: isAuthenticated } });
  const update = useUpdateSettings();

  const [form, setForm] = useState({
    heroBadge: "",
    heroTitle: "",
    heroSubtitle: "",
    heroDescription: "",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm({
        heroBadge: settings.heroBadge,
        heroTitle: settings.heroTitle,
        heroSubtitle: settings.heroSubtitle,
        heroDescription: settings.heroDescription,
      });
    }
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    update.mutate(
      { data: form },
      {
        onSuccess: () => {
          setSaved(true);
          setTimeout(() => setSaved(false), 2500);
        },
      }
    );
  };

  const f = (k: keyof typeof form, v: string) => setForm((prev) => ({ ...prev, [k]: v }));

  if (authLoading) {
    return (
      <AdminLayout title="Pengaturan">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Pengaturan">
      <div className="max-w-2xl">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground">Pengaturan Website</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Edit teks yang tampil di halaman utama publik.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-border mb-2">
              <Settings className="w-4 h-4 text-primary" />
              <span className="font-semibold text-foreground">Teks Hero (Halaman Utama)</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Label Badge
                <span className="ml-2 text-xs text-muted-foreground font-normal">
                  — teks kecil di atas judul
                </span>
              </label>
              <input
                value={form.heroBadge}
                onChange={(e) => f("heroBadge", e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Jasa Sewa Website Profesional"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Judul Utama
                <span className="ml-2 text-xs text-muted-foreground font-normal">
                  — baris pertama judul besar
                </span>
              </label>
              <input
                value={form.heroTitle}
                onChange={(e) => f("heroTitle", e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Website Impian Anda"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Judul Aksen
                <span className="ml-2 text-xs text-muted-foreground font-normal">
                  — teks berwarna setelah judul utama
                </span>
              </label>
              <input
                value={form.heroSubtitle}
                onChange={(e) => f("heroSubtitle", e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Tanpa Ribet"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Deskripsi
                <span className="ml-2 text-xs text-muted-foreground font-normal">
                  — paragraf di bawah judul
                </span>
              </label>
              <textarea
                value={form.heroDescription}
                onChange={(e) => f("heroDescription", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                placeholder="Sewa website profesional berkualitas tinggi..."
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              {saved && (
                <span className="text-sm text-green-600 font-medium">✓ Tersimpan!</span>
              )}
              <button
                type="submit"
                disabled={update.isPending}
                className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
              >
                {update.isPending ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</>
                ) : (
                  <><Save className="w-4 h-4" /> Simpan Perubahan</>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
