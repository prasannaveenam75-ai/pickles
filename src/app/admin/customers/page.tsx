"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import EmptyState from "@/components/ui/EmptyState";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/customers")
      .then((r) => r.json())
      .then((d) => { if (d.success) setCustomers(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-gray-200 rounded animate-pulse" />)}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
      {customers.length === 0 ? (
        <EmptyState title="No customers yet" description="Customers who place orders will appear here." />
      ) : (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Orders</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Total Spent</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">First Order</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c._id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-4 font-medium">{c.name}</td>
                    <td className="px-4 py-4 text-gray-600">{c.phone}</td>
                    <td className="px-4 py-4 text-gray-600">{c.email}</td>
                    <td className="px-4 py-4">{c.totalOrders}</td>
                    <td className="px-4 py-4 font-semibold">{formatPrice(c.totalSpent)}</td>
                    <td className="px-4 py-4 text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
