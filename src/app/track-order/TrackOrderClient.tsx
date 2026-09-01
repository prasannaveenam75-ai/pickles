"use client";

import { useState } from "react";
import { Package, Phone, Loader2, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const statusSteps = ["PENDING", "CONFIRMED", "PROCESSING", "PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"];

const statusLabels: Record<string, string> = {
  PENDING: "Order Placed",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  PACKED: "Packed",
  SHIPPED: "Shipped",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export default function TrackOrderClient() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<any>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/track?orderNumber=${encodeURIComponent(orderNumber)}&phone=${encodeURIComponent(phone)}`);
      const data = await res.json();
      if (data.success) {
        setOrder(data.data);
      } else {
        setError(data.message || "Unable to find order");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex = order ? statusSteps.indexOf(order.orderStatus) : -1;

  return (
    <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 text-green" />
        </div>
        <h1 className="font-display text-3xl font-bold">Track Your Order</h1>
        <p className="text-charcoal-light mt-2">Enter your order number and mobile number to track the status.</p>
      </div>

      <form onSubmit={handleTrack} className="max-w-md mx-auto bg-white rounded-xl border border-cream-dark/50 p-6 mb-10">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Order Number</label>
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="input-field uppercase"
              placeholder="e.g. DP2609010001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Mobile Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input-field"
              placeholder="10-digit mobile number"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !orderNumber || !phone}
            className="btn-primary w-full justify-center disabled:opacity-40"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Track Order"}
          </button>
        </div>
      </form>

      {error && (
        <div className="max-w-md mx-auto bg-red/10 border border-red/30 text-red rounded-lg p-4 text-sm text-center">
          {error}
        </div>
      )}

      {order && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl border border-cream-dark/50 p-6 mb-6">
            <h2 className="font-display text-xl font-bold mb-4">Order {order.orderNumber}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-xs text-charcoal-light uppercase">Status</p>
                <p className="font-semibold text-green">{statusLabels[order.orderStatus]}</p>
              </div>
              <div>
                <p className="text-xs text-charcoal-light uppercase">Total</p>
                <p className="font-semibold">{formatPrice(order.grandTotal)}</p>
              </div>
              <div>
                <p className="text-xs text-charcoal-light uppercase">Payment</p>
                <p className="font-semibold">{order.paymentStatus === "PAID" ? "Paid" : "Pending"}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-cream-dark/50 p-6">
            <h3 className="font-display text-lg font-bold mb-6">Order Timeline</h3>
            {order.orderStatus === "CANCELLED" ? (
              <div className="text-center py-8">
                <p className="text-red font-semibold">This order has been cancelled.</p>
              </div>
            ) : (
              <div className="space-y-0">
                {statusSteps.map((step, index) => {
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  return (
                    <div key={step} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          isCompleted ? "bg-green text-white" : "bg-gray-100 text-gray-400"
                        }`}>
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <span className="text-xs">{index + 1}</span>
                          )}
                        </div>
                        {index < statusSteps.length - 1 && (
                          <div className={`w-0.5 flex-1 min-h-8 ${index < currentStepIndex ? "bg-green" : "bg-gray-100"}`} />
                        )}
                      </div>
                      <div className="pb-8">
                        <p className={`font-medium ${isCurrent ? "text-green" : isCompleted ? "text-charcoal-dark" : "text-gray-400"}`}>
                          {statusLabels[step]}
                        </p>
                        {isCurrent && (
                          <p className="text-xs text-charcoal-light mt-1">
                            {new Date(order.updatedAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-cream-dark/50 p-6 mt-6">
            <h3 className="font-display text-lg font-bold mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item: any, i: number) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>{item.productName} ({item.variantName}) × {item.quantity}</span>
                  <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-cream-dark/50 mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-charcoal-light">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-light">Delivery</span>
                <span>{formatPrice(order.deliveryCharge)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{formatPrice(order.grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
