import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "wouter";
import { useGetProduct } from "@workspace/api-client-react";
import PublicLayout from "@/components/layouts/public-layout";
import {
  CheckCircle, ArrowLeft, MessageCircle, Globe, Loader2,
  ChevronLeft, ChevronRight, Expand, X, Images
} from "lucide-react";
import { formatCurrency, resolveImageUrl, buildWhatsappUrl } from "@/lib/utils";

function Lightbox({
  images,
  startIndex,
  onClose,
}: {
  images: string[];
  startIndex: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(startIndex);

  const prev = useCallback(() => setCurrent((c) => (c - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % images.length), [images.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next, onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 text-white/80 flex-shrink-0">
        <span className="text-sm font-medium">{current + 1} / {images.length}</span>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Tutup"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main image */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden min-h-0">
        <img
          key={current}
          src={images[current]}
          alt={`Foto ${current + 1}`}
          className="max-w-full max-h-full object-contain select-none"
          draggable={false}
        />

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex-shrink-0 py-3 px-4">
          <div className="flex gap-2 overflow-x-auto justify-center pb-1">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-colors ${
                  i === current ? "border-white" : "border-white/20 hover:border-white/60"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id ?? "0", 10);
  const [currentImage, setCurrentImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxStart, setLightboxStart] = useState(0);

  const { data: product, isLoading, isError } = useGetProduct(productId, {
    query: { enabled: !!productId },
  });

  const openLightbox = (index: number) => {
    setLightboxStart(index);
    setLightboxOpen(true);
  };

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </PublicLayout>
    );
  }

  if (isError || !product) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Produk Tidak Ditemukan</h1>
          <p className="text-muted-foreground mb-6">Produk yang Anda cari tidak tersedia.</p>
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
          </Link>
        </div>
      </PublicLayout>
    );
  }

  const images = product.images?.map(resolveImageUrl).filter(Boolean) ?? [];
  const whatsappUrl = buildWhatsappUrl(product.whatsappNumber, product.name);
  const hasDiscount = product.discount != null && product.discount > 0;
  const discountedPrice = hasDiscount
    ? Math.round(product.price * (1 - (product.discount as number) / 100))
    : null;

  return (
    <PublicLayout>
      {lightboxOpen && images.length > 0 && (
        <Lightbox
          images={images}
          startIndex={lightboxStart}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Beranda</Link>
          <span>/</span>
          <span className="text-foreground font-medium">{product.name}</span>
        </div>

        {/* Image Gallery */}
        <div className="mb-8">
          <div className="relative w-full aspect-[3/4] bg-muted rounded-2xl overflow-hidden">
            {images.length > 0 ? (
              <img
                src={images[currentImage]}
                alt={product.name}
                className="w-full h-full object-cover cursor-zoom-in"
                onClick={() => openLightbox(currentImage)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Globe className="w-20 h-20 text-muted-foreground/30" />
              </div>
            )}

            {images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImage((c) => (c - 1 + images.length) % images.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentImage((c) => (c + 1) % images.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Image counter */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full">
                  {currentImage + 1} / {images.length}
                </div>
              </>
            )}

            {/* Lihat Foto button */}
            {images.length > 0 && (
              <button
                onClick={() => openLightbox(currentImage)}
                className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-black/60 hover:bg-black/80 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm transition-colors"
              >
                <Expand className="w-3.5 h-3.5" />
                Lihat Foto
              </button>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    i === currentImage ? "border-primary" : "border-border hover:border-primary/50"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* All photos button — shown when there are multiple images */}
          {images.length > 1 && (
            <button
              onClick={() => openLightbox(0)}
              className="mt-3 flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Images className="w-4 h-4" />
              Lihat semua {images.length} foto
            </button>
          )}
        </div>

        {/* Product Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: name, description, features */}
          <div className="lg:col-span-2">
            {product.categoryName && (
              <span className="inline-block bg-accent text-accent-foreground text-xs px-3 py-1 rounded-full mb-3">
                {product.categoryName}
              </span>
            )}
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              {product.name}
            </h1>

            <p className="text-muted-foreground mb-6 leading-relaxed">
              {product.description}
            </p>

            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-3">Fitur Unggulan</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: price + CTA */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl p-6 sticky top-6">
              {hasDiscount ? (
                <div className="mb-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      -{product.discount}%
                    </span>
                  </div>
                  <span className="text-3xl font-bold text-primary">
                    {formatCurrency(discountedPrice!)}
                  </span>
                  <div className="text-sm text-muted-foreground line-through">
                    {formatCurrency(product.price)}
                  </div>
                </div>
              ) : (
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold text-primary">
                    {formatCurrency(product.price)}
                  </span>
                </div>
              )}
              <p className="text-sm text-muted-foreground mb-6">/bulan</p>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-xl font-semibold text-lg transition-colors shadow-sm"
              >
                <MessageCircle className="w-5 h-5" />
                Hubungi via WhatsApp
              </a>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Respon cepat, konsultasi gratis
              </p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
