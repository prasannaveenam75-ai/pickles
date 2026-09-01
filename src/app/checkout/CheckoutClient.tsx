"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { ShieldCheck, MessageCircle, CreditCard, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const indianStates = [
  "Andhra Pradesh", "Telangana", "Tamil Nadu", "Karnataka", "Kerala", "Maharashtra", "Delhi",
  "Gujarat", "Rajasthan", "Uttar Pradesh", "Madhya Pradesh", "West Bengal", "Odisha",
  "Punjab", "Haryana", "Bihar", "Jharkhand", "Chhattisgarh", "Assam", "Himachal Pradesh",
  "Uttarakhand", "Goa", "Jammu & Kashmir", "Manipur", "Meghalaya", "Nagaland", "Tripura",
  "Mizoram", "Arunachal Pradesh", "Sikkim",
];

export default function CheckoutClient() {
  const router = useRouter();
  const { items, getTotalWeight, getSubtotal, clearCart } = useCartStore();
  const [delivery, setDelivery] = useState(0);
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [error, setError] = useState("");
  const [alreadyOrdered, setAlreadyOrdered] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    houseFlat: "",
    street: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  useEffect(() => {
    if (!items.length && !alreadyOrdered) {
      router.push("/cart");
    }
  }, [items.length, router, alreadyOrdered]);

  const totalWeight = getTotalWeight();
  const subtotal = getSubtotal();

  useEffect(() => {
    const calc = async () => {
      if (!items.length) return;
      setLoading(true);
      try {
        const res = await fetch("/api/cart/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((i) => ({ productId: i.productId, variantId: i.variantId, quantity: i.quantity })),
          }),
        });
        const data = await res.json();
        if (data.success) setDelivery(data.data.deliveryCharge);
      } catch {
        setDelivery(0);
      } finally {
        setLoading(false);
      }
    };
    calc();
  }, [items]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.fullName || form.fullName.trim().length < 2) return "Please enter your full name";
    if (!form.phone || !/^[6-9]\d{9}$/.test(form.phone.replace(/\D/g, ""))) return "Please enter a valid 10-digit mobile number";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Please enter a valid email";
    if (!form.houseFlat) return "Please enter your house/flat number";
    if (!form.street) return "Please enter your street";
    if (!form.city) return "Please enter your city";
    if (!form.state) return "Please select your state";
    if (!/^\d{6}$/.test(form.pincode)) return "Please enter a valid 6-digit pincode";
    return "";
  };

  const grandTotal = subtotal + delivery;

  const loadRazorpay = async () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setProcessingPayment(true);
    setError("");

    try {
      const createRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
          })),
          shippingAddress: form,
        }),
      });
      const createData = await createRes.json();

      if (!createData.success) {
        setError(createData.message || "Unable to create order");
        setProcessingPayment(false);
        return;
      }

      const { razorpayOrderId, amount, orderId, orderNumber } = createData.data;
      const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";

      const scriptLoaded = await loadRazorpay();
      if (!scriptLoaded) {
        setError("Unable to load payment gateway. Please try again.");
        setProcessingPayment(false);
        return;
      }

      const options = {
        key: razorpayKeyId,
        amount: Math.round(amount * 100),
        currency: "INR",
        name: "Devi Pickles",
        description: `Order ${orderNumber}`,
        order_id: razorpayOrderId,
        handler: async (response: any) => {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderId,
            }),
          });
          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            setAlreadyOrdered(true);
            const localOrder = {
              orderNumber: verifyData.data.orderNumber,
              grandTotal: verifyData.data.grandTotal,
            };
            localStorage.setItem("lastOrder", JSON.stringify(localOrder));
            clearCart();
            router.push(`/order-success?order=${verifyData.data.orderNumber}`);
          } else {
            setError("Payment verification failed. Please contact support.");
            setProcessingPayment(false);
          }
        },
        prefill: {
          name: form.fullName,
          email: form.email,
          contact: form.phone,
        },
        theme: {
          color: "#1B5E20",
        },
        modal: {
          ondismiss: () => {
            setProcessingPayment(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response: any) => {
        setError(`Payment failed: ${response.error?.description || "Please try again."}`);
        setProcessingPayment(false);
      });
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      setError("An error occurred while processing payment. Please try again.");
      setProcessingPayment(false);
    }
  };

  const handleWhatsAppOrder = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    try {
      const res = await fetch("/api/whatsapp/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productName: i.productName,
            variantName: i.variantName,
            weight: i.weightInGrams >= 1000 ? "1kg" : "500g",
            weightInGrams: i.weightInGrams,
            quantity: i.quantity,
            price: i.price,
          })),
          shippingAddress: form,
        }),
      });
      const data = await res.json();
      if (data.success && data.data.url) {
        window.open(data.data.url, "_blank");
      } else {
        setError(data.message || "Unable to create WhatsApp order");
      }
    } catch {
      setError("Unable to create WhatsApp order. Please try again.");
    }
  };

  if (!items.length && !alreadyOrdered) {
    return (
      <div className="container-custom mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-bold mb-4">Your cart is empty</h1>
        <Link href="/shop" className="btn-primary">Shop Pickles</Link>
      </div>
    );
  }

  if (items.length === 0 && alreadyOrdered) {
    return (
      <div className="container-custom mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="w-10 h-10 text-green" />
        </div>
        <h1 className="font-display text-2xl font-bold mb-2">Order Placed!</h1>
        <p className="text-charcoal-light mb-6">Thank you for your order.</p>
        <Link href="/track-order" className="btn-primary mr-3">Track Order</Link>
        <Link href="/shop" className="btn-secondary">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl font-bold mb-8">Checkout</h1>

      {error && (
        <div className="bg-red/10 border border-red/30 text-red rounded-lg p-4 mb-6 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-cream-dark/50 p-6">
            <h2 className="font-display text-xl font-bold mb-6">Contact Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleInput}
                  className="input-field"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Mobile Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleInput}
                  className="input-field"
                  placeholder="10-digit mobile number"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1.5">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInput}
                  className="input-field"
                  placeholder="you@example.com"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-cream-dark/50 p-6">
            <h2 className="font-display text-xl font-bold mb-6">Shipping Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">House / Flat Number *</label>
                <input
                  type="text"
                  name="houseFlat"
                  value={form.houseFlat}
                  onChange={handleInput}
                  className="input-field"
                  placeholder="House no, flat no"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Street *</label>
                <input
                  type="text"
                  name="street"
                  value={form.street}
                  onChange={handleInput}
                  className="input-field"
                  placeholder="Street name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Area</label>
                <input
                  type="text"
                  name="area"
                  value={form.area}
                  onChange={handleInput}
                  className="input-field"
                  placeholder="Area / locality"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">City *</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleInput}
                  className="input-field"
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">State *</label>
                <select
                  name="state"
                  value={form.state}
                  onChange={handleInput}
                  className="input-field"
                >
                  <option value="">Select state</option>
                  {indianStates.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleInput}
                  className="input-field"
                  placeholder="6-digit pincode"
                  maxLength={6}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1.5">Country</label>
                <input
                  type="text"
                  name="country"
                  value={form.country}
                  onChange={handleInput}
                  className="input-field"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 h-fit">
          <div className="bg-white rounded-xl border border-cream-dark/50 p-6 mb-6">
            <h2 className="font-display text-xl font-bold mb-5">Order Summary</h2>
            <div className="space-y-3 mb-5">
              {items.map((item) => (
                <div key={`${item.productId}-${item.variantId}`} className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-cream-dark/30 flex-shrink-0">
                    {item.image ? (
                      <Image src={item.image} alt={item.productName} width={56} height={56} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-green-dark flex items-center justify-center">
                        <span className="text-white/40 text-[8px] uppercase text-center px-1">{item.productName.slice(0, 5)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.productName}</p>
                    <p className="text-xs text-charcoal-light">{item.variantName} × {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-cream-dark/50 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-charcoal-light">Subtotal</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-light">Total Weight</span>
                <span className="font-semibold">{(totalWeight / 1000).toFixed(1)} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-light">Delivery</span>
                <span className="font-semibold">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin inline" /> : formatPrice(delivery)}
                </span>
              </div>
            </div>
            <div className="border-t border-cream-dark/50 mt-4 pt-4 flex justify-between items-center">
              <span className="font-semibold">Grand Total</span>
              <span className="text-2xl font-bold">{formatPrice(grandTotal)}</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleRazorpayPayment}
              disabled={processingPayment}
              className="btn-red btn-lg w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {processingPayment ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Pay with Razorpay
                </>
              )}
            </button>
            <button
              onClick={handleWhatsAppOrder}
              className="btn-primary btn-lg w-full justify-center"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Order on WhatsApp
            </button>
            <Link href="/cart" className="flex items-center justify-center gap-2 text-sm text-charcoal-light hover:text-charcoal py-2">
              <ArrowLeft className="w-4 h-4" /> Back to Cart
            </Link>
            <p className="text-center text-xs text-charcoal-light/70 flex items-center justify-center gap-1">
              <ShieldCheck className="w-4 h-4 text-green" />
              Secure payment via Razorpay
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
