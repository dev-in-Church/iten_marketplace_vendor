"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import api from "@/lib/api";
import { formatPrice } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  TrendingUp,
  Percent,
  BadgeCheck,
  ShoppingBag,
  Calendar,
  ArrowUpRight,
  Info,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface EarningsData {
  commissionRate: number;
  totalRevenue: number;
  totalCommission: number;
  totalEarnings: number;
  earnings: {
    month: string;
    revenue: number;
    commission: number;
    earnings: number;
    orders: number;
  }[];
}

export default function VendorEarningsPage() {
  const { vendor, refreshUser } = useAuth();
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestingVerification, setRequestingVerification] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    async function fetchEarnings() {
      try {
        const data = await api.get<EarningsData>("/api/vendor/earnings");
        setEarnings(data);
      } catch {
        // No earnings yet
      } finally {
        setLoading(false);
      }
    }
    fetchEarnings();
  }, []);

  const handleRequestVerification = async () => {
    setRequestingVerification(true);
    setVerificationMessage(null);
    try {
      const response = await api.post<{ message: string }>(
        "/api/vendor/request-verification",
        {},
      );
      setVerificationMessage({ type: "success", text: response.message });
      await refreshUser();
    } catch (err: unknown) {
      setVerificationMessage({
        type: "error",
        text:
          err instanceof Error ? err.message : "Failed to request verification",
      });
    } finally {
      setRequestingVerification(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-ig-green mx-auto" />
        <p className="text-muted-foreground text-sm mt-2">
          Loading earnings...
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-2">
        Earnings & Commission
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        Track your sales and earnings. We charge a small commission on completed
        sales.
      </p>

      {/* How it works */}
      <div className="bg-ig-green-light border border-ig-green/20 rounded-xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-ig-green flex items-center justify-center shrink-0">
            <Info className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-foreground mb-2">
              How Our Commission Model Works
            </h3>
            <ul className="space-y-2 text-sm text-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-ig-green shrink-0 mt-0.5" />
                <span>
                  <strong>Free to join</strong> - No subscription fees or
                  monthly charges
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-ig-green shrink-0 mt-0.5" />
                <span>
                  <strong>Unlimited products</strong> - Add as many products as
                  you want
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-ig-green shrink-0 mt-0.5" />
                <span>
                  <strong>{earnings?.commissionRate || 10}% commission</strong>{" "}
                  - Only pay when you make a sale
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-ig-green shrink-0 mt-0.5" />
                <span>
                  <strong>Weekly payouts</strong> - Receive your earnings every
                  week
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-sm text-muted-foreground">Total Revenue</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {formatPrice(earnings?.totalRevenue || 0)}
          </p>
        </div>

        <div className="bg-white border border-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <Percent className="h-5 w-5 text-amber-600" />
            </div>
            <span className="text-sm text-muted-foreground">
              Platform Commission
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {formatPrice(earnings?.totalCommission || 0)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {earnings?.commissionRate || 10}% of sales
          </p>
        </div>

        <div className="bg-white border border-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-ig-green-light flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-ig-green" />
            </div>
            <span className="text-sm text-muted-foreground">Your Earnings</span>
          </div>
          <p className="text-2xl font-bold text-ig-green">
            {formatPrice(earnings?.totalEarnings || 0)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {100 - (earnings?.commissionRate || 10)}% of sales
          </p>
        </div>

        <div className="bg-white border border-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <span className="text-sm text-muted-foreground">
              Commission Rate
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {earnings?.commissionRate || 10}%
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Per completed sale
          </p>
        </div>
      </div>

      {/* Monthly Breakdown */}
      {earnings && earnings.earnings.length > 0 && (
        <div className="bg-white border border-border rounded-xl p-6 mb-8">
          <h2 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-ig-green" />
            Monthly Breakdown
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Month
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                    Orders
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                    Revenue
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                    Commission
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                    Your Earnings
                  </th>
                </tr>
              </thead>
              <tbody>
                {earnings.earnings.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-border/50 last:border-0"
                  >
                    <td className="py-3 px-4 text-sm font-medium text-foreground">
                      {new Date(row.month).toLocaleDateString("en-KE", {
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-foreground">
                      {row.orders}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-foreground">
                      {formatPrice(row.revenue)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-muted-foreground">
                      -{formatPrice(row.commission)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-medium text-ig-green">
                      {formatPrice(row.earnings)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No earnings yet */}
      {(!earnings || earnings.earnings.length === 0) && (
        <div className="bg-white border border-border rounded-xl p-8 text-center mb-8">
          <ShoppingBag className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-bold text-foreground mb-2">No Sales Yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Start adding products to your store and make your first sale!
          </p>
          <Button
            asChild
            className="bg-ig-green hover:bg-ig-green/90 text-white"
          >
            <a href="/dashboard/products">Add Products</a>
          </Button>
        </div>
      )}

      {/* Verification Section */}
      <div className="bg-white border border-border rounded-xl p-6">
        <h2 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <BadgeCheck className="h-5 w-5 text-ig-green" />
          Store Verification
        </h2>

        {vendor?.is_verified ? (
          <div className="bg-ig-green-light rounded-lg p-4 flex items-center gap-3">
            <BadgeCheck className="h-6 w-6 text-ig-green" />
            <div>
              <p className="font-medium text-ig-green">
                Your store is verified
              </p>
              <p className="text-xs text-foreground">
                Verified on{" "}
                {new Date(vendor.verified_at || "").toLocaleDateString("en-KE")}
              </p>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Get a verified badge on your store to build trust with customers.
              Verification is free - you just need at least 5 completed orders.
            </p>

            {verificationMessage && (
              <div
                className={`rounded-lg p-3 mb-4 flex items-center gap-2 ${
                  verificationMessage.type === "success"
                    ? "bg-ig-green-light text-ig-green"
                    : "bg-ig-red-light text-ig-red"
                }`}
              >
                {verificationMessage.type === "success" ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <span className="text-sm">{verificationMessage.text}</span>
              </div>
            )}

            <Button
              onClick={handleRequestVerification}
              disabled={requestingVerification}
              className="bg-ig-green hover:bg-ig-green/90 text-white"
            >
              {requestingVerification ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <ArrowUpRight className="h-4 w-4 mr-2" />
              )}
              Request Verification
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
