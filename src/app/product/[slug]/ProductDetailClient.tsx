"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, MessageCircle, Truck, ShieldCheck, Leaf, Heart, Clock, Play, CheckCircle } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { StarRating } from "@/components/ui/StarRating";
import TestimonialQuoteCard from "@/components/ui/TestimonialQuoteCard";
import { formatPrice } from "@/lib/utils";
import ProductCard from "@/components/ui/ProductCard";

interface ProductProps {
  product: any;
  related: any[];
  testimonials?: any[];
}

export default function ProductDetailClient({ product, related, testimonials = [] }: ProductProps) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const wishlist = useWishlistStore();
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants?.[0]?._id || ""
  );
  const [quantity, setQuantity] = useState(1);
  const [showVideo, setShowVideo] = useState(false);
  const isWishlisted = wishlist.has(product._id);

  const variants = product.variants?.filter((v: any) => v.active) || [];
  const selectedVariant = variants.find((v: any) => v._id === selectedVariantId) || variants[0];
  const images = product.images?.length ? product.images : [];
  const [mainImage, setMainImage] = useState(images[0] || "");
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999";
  const whatsappMessage = `Hi! I'm interested in ${product.name} (${selectedVariant?.weight}) from Devi Pickles. Is it available?`;

  const handleAddToCart = () => {
    if (!selectedVariant || selectedVariant.stock <= 0) return;
    addItem({
      productId: product._id,
      productName: product.name,
      variantId: selectedVariant._id,
      variantName: selectedVariant.name,
      weight: selectedVariant.weight,
      weightInGrams: selectedVariant.weightInGrams,
      price: selectedVariant.price,
      image: images[0] || "",
      quantity,
      stock: selectedVariant.stock,
      category: product.category,
    });
  };

  const handleBuyNow = () => {
    if (!selectedVariant || selectedVariant.stock <= 0) return;
    addItem({
      productId: product._id,
      productName: product.name,
      variantId: selectedVariant._id,
      variantName: selectedVariant.name,
      weight: selectedVariant.weight,
      weightInGrams: selectedVariant.weightInGrams,
      price: selectedVariant.price,
      image: images[0] || "",
      quantity,
      stock: selectedVariant.stock,
      category: product.category,
    });
    router.push("/checkout");
  };

  const inStock = selectedVariant?.stock > 0;

  const getYoutubeEmbed = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?#]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  return (
    <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-28 lg:pb-10">
      <nav className="text-xs text-charcoal-light mb-6 flex flex-wrap items-center gap-1">
        <Link href="/" className="hover:text-maroon">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-maroon">Shop</Link>
        <span>/</span>
        <span className="text-charcoal">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-cream-dark/40 relative border border-cream-dark/50">
            {mainImage ? (
              <Image
                src={mainImage}
                alt={product.name}
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-maroon/20 to-golden/10">
                <span className="text-charcoal-light/30 font-display text-xl uppercase tracking-widest text-center px-8">
                  {product.name}
                </span>
              </div>
            )}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.bestSeller && <span className="badge bg-red text-white">Best Seller</span>}
              {product.newProduct && <span className="badge bg-veg text-white">New</span>}
              {product.seasonal && <span className="badge bg-golden text-maroon-dark">Seasonal</span>}
            </div>
            {product.videoUrl && (
              <button
                onClick={() => setShowVideo(true)}
                className="absolute bottom-4 right-4 w-12 h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                aria-label="Watch video"
              >
                <Play className="w-5 h-5 text-maroon ml-0.5" fill="currentColor" />
              </button>
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-3 mt-3">
              {images.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setMainImage(img)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    mainImage === img ? "border-maroon" : "border-transparent"
                  }`}
                >
                  <div className="relative w-full h-full">
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" sizes="100px" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <span className="text-xs tracking-wider uppercase text-charcoal-light/60 font-semibold">
            {product.category}
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-charcoal-dark mt-2 mb-3 uppercase">
            {product.name}
          </h1>

          {product.shortDescription && (
            <p className="text-charcoal-light text-base leading-relaxed mb-4">{product.shortDescription}</p>
          )}

          <div className="flex items-center gap-3 mb-6">
            <StarRating rating={Math.round(product.rating || 5)} />
            <span className="text-xs text-charcoal-light">
              {product.rating ? product.rating.toFixed(1) : "5.0"} · {product.reviewCount || 0}{" "}
              {product.reviewCount === 1 ? "review" : "reviews"}
            </span>
            <span className="text-xs text-charcoal-light/60">Homemade Quality</span>
          </div>

          <div className="text-3xl font-bold text-charcoal-dark mb-2">
            {selectedVariant ? formatPrice(selectedVariant.price) : "—"}
            {selectedVariant?.compareAtPrice && selectedVariant.compareAtPrice > selectedVariant.price && (
              <>
                <span className="text-lg text-charcoal-light line-through ml-3 font-normal">
                  {formatPrice(selectedVariant.compareAtPrice)}
                </span>
                <span className="text-sm text-red ml-2 font-semibold">
                  {Math.round(((selectedVariant.compareAtPrice - selectedVariant.price) / selectedVariant.compareAtPrice) * 100)}% OFF
                </span>
              </>
            )}
          </div>
          <p className="text-sm text-charcoal-light mb-6">Price includes all taxes</p>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-charcoal-dark mb-3">Select Weight</h3>
            <div className="flex gap-3">
              {variants.map((v: any) => (
                <button
                  key={v._id}
                  onClick={() => { setSelectedVariantId(v._id); setQuantity(1); }}
                  disabled={v.stock <= 0}
                  className={`px-6 py-3 rounded-xl border-2 transition-all ${
                    selectedVariantId === v._id
                      ? "border-maroon bg-maroon text-white shadow-md"
                      : "border-cream-dark bg-white text-charcoal hover:border-maroon/50"
                  } ${v.stock <= 0 ? "opacity-40 cursor-not-allowed" : ""}`}
                >
                  <span className="text-sm font-semibold block">{v.weight}</span>
                  <span className={`text-xs ${selectedVariantId === v._id ? "text-white/80" : "text-charcoal-light"}`}>
                    ₹{v.price}
                  </span>
                </button>
              ))}
            </div>
            {selectedVariant && (
              <p className={`mt-3 text-sm ${inStock ? "text-veg" : "text-red"}`}>
                {inStock ? (
                  <>
                    <ShieldCheck className="inline w-4 h-4 mr-1" />
                    In Stock ({selectedVariant.stock} available)
                  </>
                ) : (
                  "Out of Stock"
                )}
              </p>
            )}
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-semibold text-charcoal-dark mb-3">Quantity</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-lg border border-cream-dark flex items-center justify-center hover:border-maroon transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(selectedVariant?.stock || 1, quantity + 1))}
                className="w-10 h-10 rounded-lg border border-cream-dark flex items-center justify-center hover:border-maroon transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="btn-primary btn-lg disabled:opacity-40 disabled:cursor-not-allowed w-full"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={!inStock}
              className="btn-golden btn-lg disabled:opacity-40 disabled:cursor-not-allowed w-full"
            >
              Buy Now
            </button>
          </div>

          <button
            onClick={() => wishlist.toggle(product._id)}
            className={`inline-flex items-center gap-2 text-sm font-semibold mb-6 transition-colors ${
              isWishlisted ? "text-red" : "text-charcoal-light hover:text-red"
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
            {isWishlisted ? "Added to Wishlist" : "Add to Wishlist"}
          </button>

          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-veg hover:text-veg-light transition-colors mb-8"
          >
            <MessageCircle className="w-4 h-4" />
            Enquire on WhatsApp
          </a>

          <div className="bg-cream rounded-xl p-5 space-y-3 border border-cream-dark/30">
            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-veg flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-charcoal-dark">Delivery Information</p>
                <p className="text-xs text-charcoal-light">Delivery charge ₹100 per kg. Calculated based on total order weight.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Leaf className="w-5 h-5 text-veg flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-charcoal-dark">100% Natural</p>
                <p className="text-xs text-charcoal-light">Prepared with authentic ingredients and traditional methods.</p>
              </div>
            </div>
            {product.shelfLife && (
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-veg flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-charcoal-dark">Shelf Life</p>
                  <p className="text-xs text-charcoal-light">{product.shelfLife}</p>
                </div>
              </div>
            )}
            {product.storageInstructions && (
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-veg flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-charcoal-dark">Storage</p>
                  <p className="text-xs text-charcoal-light">{product.storageInstructions}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showVideo && product.videoUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setShowVideo(false)}>
          <div className="bg-white rounded-2xl overflow-hidden max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="aspect-video">
              {getYoutubeEmbed(product.videoUrl) ? (
                <iframe
                  src={getYoutubeEmbed(product.videoUrl)!}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              ) : (
                <video src={product.videoUrl} controls className="w-full h-full object-cover" />
              )}
            </div>
            <button onClick={() => setShowVideo(false)} className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900">
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="font-display text-2xl font-bold mb-4">Description</h2>
          <p className="text-charcoal-light leading-relaxed whitespace-pre-line">{product.description}</p>
        </div>
        {product.ingredients?.length > 0 && (
          <div>
            <h2 className="font-display text-2xl font-bold mb-4">Ingredients</h2>
            <ul className="space-y-2">
              {product.ingredients.map((ing: string) => (
                <li key={ing} className="flex items-center gap-3 text-charcoal-light">
                  <span className="w-1.5 h-1.5 rounded-full bg-golden" />
                  {ing}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {product.benefits?.length > 0 && (
        <div className="mb-16 bg-cream rounded-2xl p-8 border border-cream-dark/30">
          <h2 className="font-display text-2xl font-bold mb-6 text-center">Health Benefits</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {product.benefits.map((benefit: string, i: number) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-cream-dark/20">
                <CheckCircle className="w-5 h-5 text-veg flex-shrink-0 mt-0.5" />
                <span className="text-sm text-charcoal-light">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {product.preparationMethod && (
        <div className="mb-16">
          <h2 className="font-display text-2xl font-bold mb-4">Preparation Method</h2>
          <div className="bg-cream rounded-2xl p-8 border border-cream-dark/30">
            <p className="text-charcoal-light leading-relaxed whitespace-pre-line">{product.preparationMethod}</p>
          </div>
        </div>
      )}

      {testimonials?.length > 0 && (
        <section className="mb-16">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3">
              <span className="font-display text-3xl font-bold text-charcoal-dark">{product.rating || 5}</span>
              <StarRating rating={Math.round(product.rating || 5)} size="md" />
              <span className="text-sm text-charcoal-light">
                {product.reviewCount || 0} verified reviews
              </span>
            </div>
            <h2 className="font-display text-2xl font-bold mt-3">What Our Customers Say</h2>
            <p className="section-subtitle">Reviews for {product.name}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {testimonials.map((t: any) => (
              <TestimonialQuoteCard key={t._id} testimonial={t} />
            ))}
          </div>
        </section>
      )}

      {related?.length > 0 && (
        <div className="mb-16">
          <h2 className="font-display text-2xl font-bold mb-8 text-center">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map((p: any) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Mobile sticky bottom CTA */}
      {inStock && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-cream-dark/30 p-3 lg:hidden safe-area-bottom">
          <div className="container-custom mx-auto flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-charcoal-light">Price</p>
              <p className="text-base font-bold text-charcoal-dark">
                {selectedVariant ? formatPrice(selectedVariant.price * quantity) : "—"}
              </p>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-maroon text-white text-sm font-bold py-3 rounded-full hover:bg-maroon-light transition-colors"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-golden text-white text-sm font-bold py-3 rounded-full hover:bg-golden-light transition-colors"
            >
              Buy Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}