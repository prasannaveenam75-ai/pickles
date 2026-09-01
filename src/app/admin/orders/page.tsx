"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import EmptyState from "@/components/ui/EmptyState";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-orange-100 text-orange-800",
  PACKED: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  OUT_FOR_DELIVERY: "bg-cyan-100 text-cyan-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  useEffect(() => {
    fetchOrders();
  }, [status, page, search]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (status) params.set("status", status);
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/orders?${params}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
        setTotal(data.pagination?.total || 0);
      }
    } catch {}
    finally { setLoading(false); }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Orders</h1>

      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="admin-input max-w-xs"
          placeholder="Search order #, name, phone..."
        />
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="admin-input max-w-xs">
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PROCESSING">Processing</option>
          <option value="PACKED">Packed</option>
          <option value="SHIPPED">Shipped</option>
          <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />)}</div>
      ) : orders.length === 0 ? (
        <EmptyState title="No orders found" description="Orders will appear here when customers place them." />
      ) : (
        <>
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Order #</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Weight</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Total</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Payment</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <Link href={`/admin/orders/${order._id}`} className="font-medium text-green hover:underline">
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium">{order.customer?.name}</p>
                        <p className="text-xs text-gray-500">{order.customer?.phone}</p>
                      </td>
                      <td className="px-4 py-4">{(order.totalWeight / 1000).toFixed(1)} kg</td>
                      <td className="px-4 py-4 font-semibold">{formatPrice(order.grandTotal)}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.paymentStatus === "PAID" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.orderStatus] || "bg-gray-100"}`}>
                          {order.orderStatus?.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-500">{new Date(order.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-4 py-2 border rounded-lg text-sm disabled:opacity-40">Previous</button>
              <span className="px-4 py-2 text-sm">Page {page} of {totalPages}</span>
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-4 py-2 border rounded-lg text-sm disabled:opacity-40">Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
