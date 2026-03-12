"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import api from "@/lib/api";
import { formatPrice } from "@/lib/mock-data";
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Percent,
  BadgeCheck,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  vendorEarnings: number;
  platformCommission: number;
  commissionRate: number;
}

export default function VendorDashboardPage() {
  const { user, vendor } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    vendorEarnings: 0,
    platformCommission: 0,
    commissionRate: 10,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await api.get<{ stats: DashboardStats }>("/api/dashboard");
        setStats(data.stats);
      } catch {
        // Use defaults
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome back, {user?.firstName}!
        </p>
      </div>

      {/* Free Platform Notice */}
      <div className="bg-ig-green-light border border-ig-green/20 rounded-lg p-4 mb-6 flex items-start gap-3">
        <CheckCircle className="h-5 w-5 text-ig-green shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-ig-green">
            Free to Sell on ItenGear
          </p>
          <p className="text-xs text-foreground mt-0.5">
            No subscription fees! Add unlimited products and only pay a{" "}
            {stats.commissionRate}% commission on completed sales.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-blue-50">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {loading ? "-" : stats.activeProducts}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Active Products</p>
        </div>

        <div className="bg-white border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-purple-50">
              <ShoppingCart className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {loading ? "-" : stats.totalOrders}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Total Orders</p>
          {stats.pendingOrders > 0 && (
            <p className="text-xs text-amber-600 mt-1">
              {stats.pendingOrders} pending
            </p>
          )}
        </div>

        <div className="bg-white border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-ig-green-light">
              <DollarSign className="h-5 w-5 text-ig-green" />
            </div>
          </div>
          <p className="text-2xl font-bold text-ig-green">
            {loading ? "-" : formatPrice(stats.vendorEarnings)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Your Earnings</p>
        </div>

        <div className="bg-white border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-amber-50">
              <Percent className="h-5 w-5 text-amber-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {loading ? "-" : `${stats.commissionRate}%`}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Commission Rate</p>
        </div>
      </div>

      {/* Earnings Summary */}
      <div className="bg-white border border-border rounded-lg p-6 mb-8">
        <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-ig-green" />
          Earnings Summary
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
            <p className="text-xl font-bold text-foreground">
              {formatPrice(stats.totalRevenue)}
            </p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">
              Platform Commission ({stats.commissionRate}%)
            </p>
            <p className="text-xl font-bold text-foreground">
              -{formatPrice(stats.platformCommission)}
            </p>
          </div>
          <div className="bg-ig-green-light rounded-lg p-4">
            <p className="text-sm text-ig-green mb-1">Your Earnings</p>
            <p className="text-xl font-bold text-ig-green">
              {formatPrice(stats.vendorEarnings)}
            </p>
          </div>
        </div>
      </div>

      {/* Verification Status */}
      {!vendor?.is_verified && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">
              Store Not Yet Verified
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              Complete 5 orders to request verification and get a verified badge
              on your store. This helps build trust with buyers.
            </p>
          </div>
        </div>
      )}

      {vendor?.is_verified && (
        <div className="bg-ig-green-light border border-ig-green/20 rounded-lg p-4 mb-8 flex items-start gap-3">
          <BadgeCheck className="h-5 w-5 text-ig-green shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-ig-green">
              Verified Store
            </p>
            <p className="text-xs text-foreground mt-0.5">
              Your store is verified. Customers see your verified badge when
              browsing your products.
            </p>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="bg-white border border-border rounded-lg p-6">
        <h2 className="font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          <a
            href="/dashboard/products"
            className="p-4 rounded-lg border border-border hover:border-ig-green hover:shadow-sm transition-all text-center"
          >
            <Package className="h-6 w-6 text-ig-green mx-auto mb-2" />
            <p className="text-sm font-medium text-foreground">
              Manage Products
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Add or edit your products
            </p>
          </a>
          <a
            href="/dashboard/orders"
            className="p-4 rounded-lg border border-border hover:border-ig-green hover:shadow-sm transition-all text-center"
          >
            <ShoppingCart className="h-6 w-6 text-ig-green mx-auto mb-2" />
            <p className="text-sm font-medium text-foreground">View Orders</p>
            <p className="text-xs text-muted-foreground mt-1">
              Manage customer orders
            </p>
          </a>
          <a
            href="/dashboard/subscription"
            className="p-4 rounded-lg border border-border hover:border-ig-green hover:shadow-sm transition-all text-center"
          >
            <DollarSign className="h-6 w-6 text-ig-green mx-auto mb-2" />
            <p className="text-sm font-medium text-foreground">View Earnings</p>
            <p className="text-xs text-muted-foreground mt-1">
              Track your earnings
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
