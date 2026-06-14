import { useState } from "react";
import { Link } from "wouter";
import { useListProducts, useListCategories, useGetSettings } from "@workspace/api-client-react";
import PublicLayout from "@/components/layouts/public-layout";
import { Search, Globe, Star, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { formatCurrency, resolveImageUrl } from "@/lib/utils";
import type { Product } from "@workspace/api-client-react";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const { data: products, isLoading: loadingProducts } = useListProducts({
    search: search || undefined,
    category: selectedCategory || undefined,
  });

  const { data: categories } = useListCategories();
  const { data: settings } = useGetSettings();

  const heroBadge = settings?.heroBadge ?? "Sewa website dengan harga terjangkau!";
  const heroTitle = settings?.heroTitle ?? "Website siap pakai";
  const heroSubtitle = settings?.heroSubtitle ?? "Tanpa ribet";
  const heroDescription = settings?.heroDescription ?? " Hadirkan website pada bisnis anda dengan mudah dan cepat, Tersedia berbagai pilihan template hingga costum sesuai kebutuhan anda";

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/20 py-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Globe className="w-4 h-4" />
            {heroBadge}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            {heroTitle},{" "}
            <span className="text-primary">{heroSubtitle}</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            {heroDescription}
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="search"
                placeholder="Cari website..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary shadow-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section className="border-y border-border bg-card py-5">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-sm text-muted-foreground">
            {["Setup cepat & mudah", "Support responsif", "Domain & hosting included", "Update berkala"].map((f) => (
              <div key={f} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Pilihan Website</h2>
              <p className="text-muted-foreground mt-1">
                {products?.length ?? 0} website tersedia
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                  selectedCategory === ""
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:border-primary hover:text-primary"
                }`}
              >
                Semua
              </button>
              {categories?.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                    selectedCategory === cat.name
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:border-primary hover:text-primary"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {loadingProducts ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : products?.length === 0 ? (
            <div className="text-center py-20">
              <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Tidak ada produk ditemukan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16 px-4">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Sudah punya website dari kami?
          </h2>
          <p className="text-primary-foreground/80 mb-8">
            Cek status dan masa aktif website Anda dengan mudah.
          </p>
          <Link
            href="/cek-website"
            className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-xl font-semibold hover:bg-white/90 transition-colors"
          >
            Cek Website Saya
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}

function ProductCard({ product }: { product: Product }) {
  const image = resolveImageUrl(product.images?.[0]);
  const hasDiscount = product.discount != null && product.discount > 0;
  const discountedPrice = hasDiscount
    ? Math.round(product.price * (1 - (product.discount as number) / 100))
    : null;

  return (
    <Link href={`/produk/${product.id}`}>
      <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-200 cursor-pointer group">
        <div className="relative aspect-video bg-muted overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Globe className="w-12 h-12 text-muted-foreground/30" />
            </div>
          )}
          <div className="absolute top-3 left-3 flex gap-2">
            {product.categoryName && (
              <span className="bg-black/60 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
                {product.categoryName}
              </span>
            )}
            {hasDiscount && (
              <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                -{product.discount}%
              </span>
            )}
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {product.description}
          </p>
          {product.features && product.features.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {product.features.slice(0, 3).map((f, i) => (
                <span
                  key={i}
                  className="text-xs bg-accent text-accent-foreground px-2.5 py-1 rounded-full"
                >
                  {f}
                </span>
              ))}
              {product.features.length > 3 && (
                <span className="text-xs text-muted-foreground px-2.5 py-1">
                  +{product.features.length - 3}
                </span>
              )}
            </div>
          )}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground">Harga/bulan</p>
              {hasDiscount ? (
                <div className="flex items-baseline gap-2">
                  <p className="text-lg font-bold text-primary">
                    {formatCurrency(discountedPrice!)}
                  </p>
                  <p className="text-sm text-muted-foreground line-through">
                    {formatCurrency(product.price)}
                  </p>
                </div>
              ) : (
                <p className="text-lg font-bold text-primary">
                  {formatCurrency(product.price)}
                </p>
              )}
            </div>
            <span className="text-sm text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
              Lihat Detail <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
