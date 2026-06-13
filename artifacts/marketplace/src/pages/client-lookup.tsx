import { useState } from "react";
import { useLookupClientByWebsiteId } from "@workspace/api-client-react";
import PublicLayout from "@/components/layouts/public-layout";
import { Search, Globe, CheckCircle, XCircle, Clock, AlertTriangle, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ClientLookupPage() {
  const [websiteId, setWebsiteId] = useState("");
  const [searchId, setSearchId] = useState("");

  const { data: client, isLoading, isError, error } = useLookupClientByWebsiteId(
    searchId,
    { query: { enabled: !!searchId, retry: false } }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = websiteId.trim();
    if (cleaned && /^[0-9]+$/.test(cleaned)) {
      setSearchId(cleaned);
    }
  };

  const getDaysInfo = () => {
    if (!client) return null;
    const days = client.daysRemaining ?? 0;
    if (days < 0) return { label: "Sudah Kedaluwarsa", color: "text-destructive", bg: "bg-destructive/10", icon: XCircle };
    if (days <= 7) return { label: `${days} hari lagi`, color: "text-orange-600", bg: "bg-orange-50", icon: AlertTriangle };
    return { label: `${days} hari lagi`, color: "text-green-600", bg: "bg-green-50", icon: CheckCircle };
  };

  const daysInfo = getDaysInfo();

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-5">
            <Globe className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">Cek Status Website</h1>
          <p className="text-muted-foreground">
            Masukkan ID website Anda untuk melihat informasi status dan masa aktif.
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm mb-6">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Masukkan ID Website (angka)"
                value={websiteId}
                onChange={(e) => setWebsiteId(e.target.value.replace(/\D/g, ""))}
                className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>
            <button
              type="submit"
              disabled={!websiteId.trim() || isLoading}
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Cek
            </button>
          </form>
        </div>

        {/* Result */}
        {isError && searchId && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-6 text-center">
            <XCircle className="w-10 h-10 text-destructive mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-1">Website Tidak Ditemukan</h3>
            <p className="text-sm text-muted-foreground">
              Tidak ada website dengan ID <strong>{searchId}</strong>. Periksa kembali ID Anda.
            </p>
          </div>
        )}

        {client && (
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-primary/5 border-b border-border px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{client.websiteName}</h3>
                  <p className="text-xs text-muted-foreground">ID: {client.websiteId}</p>
                </div>
                <span
                  className={`ml-auto px-3 py-1 rounded-full text-xs font-medium ${
                    client.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {client.status === "active" ? "Aktif" : "Tidak Aktif"}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* URL */}
              <div className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-sm text-muted-foreground">URL Website</span>
                <a
                  href={client.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline font-medium"
                >
                  {client.url}
                </a>
              </div>

              {/* Dates */}
              <div className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Tanggal Mulai</span>
                <span className="text-sm font-medium text-foreground">{formatDate(client.startDate)}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Tanggal Berakhir</span>
                <span className="text-sm font-medium text-foreground">{formatDate(client.endDate)}</span>
              </div>

              {/* Days remaining */}
              {daysInfo && (
                <div className={`flex items-center gap-3 p-4 rounded-xl ${daysInfo.bg}`}>
                  <daysInfo.icon className={`w-5 h-5 ${daysInfo.color} flex-shrink-0`} />
                  <div>
                    <p className={`font-semibold ${daysInfo.color}`}>Sisa Masa Aktif</p>
                    <p className={`text-sm ${daysInfo.color}`}>{daysInfo.label}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Info */}
        {!searchId && !isLoading && (
          <div className="mt-8 bg-accent/50 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-foreground mb-1">Cara Cek Status Website</h4>
                <p className="text-sm text-muted-foreground">
                  Masukkan ID website numerik yang Anda dapatkan saat mendaftar layanan kami. 
                  ID dapat ditemukan di email konfirmasi atau invoice pembayaran Anda.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
