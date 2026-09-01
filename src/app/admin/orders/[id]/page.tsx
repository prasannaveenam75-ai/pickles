"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { MapPin, Phone, Mail, Package, ArrowLeft } from "lucide-react";

const orderStatuses = [
  "PENDING", "CONFIRMED", "PROCESSING", "PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED",
];

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setOrder(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: newStatus, notes: note || undefined }),
      });
      const data = await res.json();
      if (data.success) setOrder(data.data);
      setNote("");
    } catch {}
    finally { setUpdating(false); }
  };

  if (loading) {
    return <div className="space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-200 rounded animate-pulse" />)}</div>;
  }

  if (!order) return <div>Order not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.push("/admin/orders")} className="p-2 bg-white border rounded-lg text-gray-500 hover:text-green">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order {order.orderNumber}</h1>
          <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h2 className="font-semibold text-lg mb-4">Items</h2>
            <div className="space-y-3">
              {order.items.map((item: any, i: number) => (
                <div key={i} className="flex justify-between border-b last:border-0 pb-3">
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-xs text-gray-500">{item.variantName} × {item.quantity} • {(item.weightInGrams * item.quantity) / 1000} kg</p>
                  </div>
                  <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2 text-sm border-t pt-4">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
              {order.discountAmount > 0 && <div className="flex justify-between"><span className="text-gray-500">Coupon ({order.couponCode})</span><span className="text-red">-{formatPrice(order.discountAmount)}</span></div>}
              <div className="flex justify-between"><span className="text-gray-500">Delivery ({formatPrice(order.deliveryCharge)} total weight {order.totalWeight / 1000}kg)</span><span>{formatPrice(order.deliveryCharge)}</span></div>
              <div className="flex justify-between font-bold text-base"><span>Grand Total</span><span>{formatPrice(order.grandTotal)}</span></div>
            </div>
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h2 className="font-semibold text-lg mb-4">Update Status</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {orderStatuses.map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(s)}
                  disabled={updating}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                    s === order.orderStatus ? "bg-green text-white border-green" : "bg-white text-gray-700 hover:border-green"
                  }`}
                >
                  {s.replace(/_/g, " ")}
                </button>
              ))}
            </div>
            <div className="mt-4">
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="admin-input"
                placeholder="Add a note for this status change (optional)"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h2 className="font-semibold text-lg mb-4">Order Timeline</h2>
            <div className="space-y-3">
              {[...order.statusHistory].reverse().map((entry: any, i: number) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-green mt-1" />
                    {i < order.statusHistory.length - 1 && <div className="w-0.5 flex-1 bg-gray-200" />}
                  </div>
                  <div className="pb-4">
                    <p className="font-medium text-sm">{entry.status.replace(/_/g, " ")}</p>
                    <p className="text-xs text-gray-500">{new Date(entry.timestamp).toLocaleString()}</p>
                    {entry.note && <p className="text-xs text-gray-600 mt-1">{entry.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h2 className="font-semibold text-lg mb-4">Customer</h2>
            <div className="space-y-3 text-sm">
              <p className="font-medium text-base">{order.customer?.name}</p>
              <p className="flex items-center gap-2 text-gray-600"><Phone className="w-4 h-4" /> {order.customer?.phone}</p>
              <p className="flex items-center gap-2 text-gray-600"><Mail className="w-4 h-4" /> {order.customer?.email}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h2 className="font-semibold text-lg mb-4">Shipping Address</h2>
            <p className="flex items-start gap-2 text-sm text-gray-600"><MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>
                {order.shippingAddress?.houseFlat}, {order.shippingAddress?.street}
                {order.shippingAddress?.area && `, ${order.shippingAddress.area}`}
                <br />{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                <br />{order.shippingAddress?.country}
              </span>
            </p>
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h2 className="font-semibold text-lg mb-4">Payment</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Method</span><span className="uppercase font-medium">{order.paymentMethod}</span></div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className={`font-medium ${order.paymentStatus === "PAID" ? "text-green" : "text-yellow-600"}`}>{order.paymentStatus}</span>
              </div>
              {order.razorpayOrderId && <div className="text-xs text-gray-500">Razorpay Order: {order.razorpayOrderId}</div>}
              {order.razorpayPaymentId && <div className="text-xs text-gray-500">Payment: {order.razorpayPaymentId}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
