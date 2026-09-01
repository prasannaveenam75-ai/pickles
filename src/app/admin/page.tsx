"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag, Package, TrendingUp, Users, Clock, AlertCircle, CheckCircle2, IndianRupee,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setData(d.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const stats = data ? [
    { label: "Total Orders", value: data.totalOrders, icon: ShoppingBag, color: "bg-blue-50 text-blue-600" },
    { label: "Today's Orders", value: data.todayOrders, icon: Clock, color: "bg-orange-50 text-orange-600" },
    { label: "Pending Orders", value: data.pendingOrders, icon: AlertCircle, color: "bg-yellow-50 text-yellow-600" },
    { label: "Paid Orders", value: data.paidOrders, icon: CheckCircle2, color: "bg-green-50 text-green-600" },
    { label: "Delivered", value: data.deliveredOrders, icon: Package, color: "bg-purple-50 text-purple-600" },
    { label: "Total Revenue", value: formatPrice(data.totalRevenue), icon: IndianRupee, color: "bg-emerald-50 text-emerald-600" },
    { label: "Products", value: data.totalProducts, icon: Package, color: "bg-indigo-50 text-indigo-600" },
    { label: "Low Stock", value: data.lowStockProducts, icon: AlertCircle, color: "bg-red-50 text-red-600" },
  ] : [];

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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border shadow-sm p-5">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border shadow-sm">
        <div className="p-5 border-b flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-green hover:text-green-light">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Order</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Total</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Payment</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody>
              {data?.recentOrders?.length ? (
                data.recentOrders.map((order: any) => (
                  <tr key={order._id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <Link href={`/admin/orders/${order._id}`} className="font-medium text-green hover:underline">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium">{order.customer?.name}</p>
                      <p className="text-xs text-gray-500">{order.customer?.phone}</p>
                    </td>
                    <td className="px-5 py-4 font-semibold">{formatPrice(order.grandTotal)}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.paymentStatus === "PAID" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.orderStatus] || "bg-gray-100"}`}>
                        {order.orderStatus?.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-gray-500">
                    No orders yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
