"use client";

import { motion } from "motion/react";
import {
  CheckCircle2, Clock, PackageCheck, Truck, Home, X, Printer,
  MapPin, CreditCard, AlertCircle, FileText, ChevronRight, Copy, Check
} from "lucide-react";
import { useState } from "react";
import { formatMoney } from "@/lib/format";
import type { CustomerOrder } from "@/types/store";

interface OrderDetailModalProps {
  order: CustomerOrder | null;
  onClose: () => void;
}

const statusSteps = [
  { key: "pending", label: "Order Placed", icon: FileText, desc: "Order details received" },
  { key: "processing", label: "Processing", icon: PackageCheck, desc: "Warehouse preparing hardware" },
  { key: "shipped", label: "Shipped", icon: Truck, desc: "On the way with courier" },
  { key: "delivered", label: "Delivered", icon: Home, desc: "Package delivered" },
];

function getStepIndex(status: string): number {
  switch (status.toLowerCase()) {
    case "pending":
      return 0;
    case "processing":
      return 1;
    case "shipped":
      return 2;
    case "delivered":
      return 3;
    default:
      return 0;
  }
}

export default function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  const currentStep = getStepIndex(order.status);
  const isCancelled = order.status === "cancelled" || order.status === "refunded";

  const handleCopyTracking = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <motion.div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-line pb-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-display text-2xl font-bold text-navy">
                Order #{order.orderNumber}
              </h2>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                  order.status === "delivered"
                    ? "bg-green-100 text-green-800"
                    : order.status === "processing"
                      ? "bg-amber-100 text-amber-800"
                      : order.status === "shipped"
                        ? "bg-blue-100 text-blue-800"
                        : isCancelled
                          ? "bg-red-100 text-red-800"
                          : "bg-sky-100 text-sky-800"
                }`}
              >
                {order.status}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted">
              Placed on {new Date(order.placedAt).toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-page p-2 text-muted transition hover:bg-line/60 hover:text-navy"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Daraz-Style Live Order Status Tracker */}
        {!isCancelled ? (
          <div className="mt-6 rounded-2xl border border-line bg-gradient-to-br from-page/60 to-white p-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-4">
              Order Status & Delivery Timeline
            </h3>

            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-5 left-5 right-5 h-1 bg-line -z-0 hidden sm:block">
                <div
                  className="h-full bg-brand transition-all duration-500"
                  style={{ width: `${(currentStep / 3) * 100}%` }}
                />
              </div>

              {/* Status Steps Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative z-10">
                {statusSteps.map((step, idx) => {
                  const isDone = idx <= currentStep;
                  const isCurrent = idx === currentStep;
                  const StepIcon = step.icon;

                  return (
                    <div key={step.key} className="flex sm:flex-col items-center gap-3 sm:gap-2 text-left sm:text-center">
                      <div
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold transition-all ${
                          isDone
                            ? "bg-brand text-white shadow-md shadow-brand/20"
                            : "bg-white border-2 border-line text-muted"
                        }`}
                      >
                        {isDone ? <CheckCircle2 size={18} /> : <StepIcon size={16} />}
                      </div>
                      <div>
                        <p className={`text-xs font-bold ${isDone ? "text-navy" : "text-muted"}`}>
                          {step.label}
                        </p>
                        <p className="text-[11px] text-muted leading-tight mt-0.5 hidden sm:block">
                          {isCurrent ? "Current Status" : isDone ? "Completed" : step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 flex items-center gap-3 rounded-2xl bg-red-50 p-4 text-red-800 text-sm">
            <AlertCircle size={20} className="shrink-0" />
            <div>
              <p className="font-bold">Order Cancelled or Refunded</p>
              <p className="text-xs text-red-700 mt-0.5">
                This order was cancelled. If you have questions regarding payment refund, please contact customer support.
              </p>
            </div>
          </div>
        )}

        {/* Courier & Tracking Information */}
        {order.shipments && order.shipments.length > 0 && (
          <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50/50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-blue-900">
                <Truck size={18} className="text-brand" />
                Shipment Tracking Info
              </div>
              <span className="text-xs font-medium text-blue-700 bg-white px-2.5 py-1 rounded-full border border-blue-200">
                {order.shipments[0].carrier}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between gap-2 rounded-xl bg-white p-3 text-xs border border-blue-100">
              <span className="text-muted">Tracking #: <strong className="text-navy">{order.shipments[0].trackingNumber}</strong></span>
              <button
                type="button"
                onClick={() => handleCopyTracking(order.shipments![0].trackingNumber)}
                className="flex items-center gap-1 font-semibold text-brand hover:underline"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        )}

        {/* Items Ordered List */}
        <div className="mt-6">
          <h3 className="font-display text-sm font-bold text-navy mb-3 flex items-center gap-2">
            <FileText size={16} className="text-brand" /> Items in this Order ({order.items.length})
          </h3>
          <div className="divide-y divide-line rounded-2xl border border-line overflow-hidden">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between gap-4 bg-white p-4 text-sm transition hover:bg-page/40">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-navy line-clamp-1">{item.title}</p>
                  <p className="text-xs text-muted font-mono mt-0.5">SKU: {item.sku}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-navy">{formatMoney(item.lineTotal)}</p>
                  <p className="text-xs text-muted">
                    {formatMoney(item.unitPrice)} × {item.qty}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details & Summary Grid */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {/* Shipping & Payment Info */}
          <div className="rounded-2xl border border-line p-4 text-xs space-y-3 bg-white">
            <h4 className="font-bold text-navy text-xs uppercase tracking-wider flex items-center gap-1.5">
              <MapPin size={14} className="text-brand" /> Shipping Address
            </h4>
            {order.shippingAddress ? (
              <div className="text-muted leading-relaxed">
                <p className="font-semibold text-navy">
                  {[order.shippingAddress.firstName, order.shippingAddress.lastName].filter(Boolean).join(" ") || "Customer"}
                </p>
                {order.shippingAddress.company && <p>{order.shippingAddress.company}</p>}
                <p>{order.shippingAddress.address || "Address provided at checkout"}</p>
                {order.shippingAddress.phone && <p>📞 {order.shippingAddress.phone}</p>}
                {order.shippingAddress.email && <p>✉️ {order.shippingAddress.email}</p>}
              </div>
            ) : (
              <p className="text-muted">Standard delivery address</p>
            )}

            <div className="pt-2 border-t border-line">
              <p className="font-bold text-navy text-xs uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard size={14} className="text-brand" /> Payment Method
              </p>
              <p className="mt-1 font-semibold text-navy uppercase">
                {order.paymentMethod === "cod" ? "Cash on Delivery (COD)" : order.paymentMethod}
              </p>
              <p className="text-[11px] text-muted">
                Payment Status: <span className="font-semibold capitalize text-navy">{order.paymentStatus || "Pending"}</span>
              </p>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="rounded-2xl border border-line p-4 text-xs space-y-2 bg-page/50 flex flex-col justify-between">
            <h4 className="font-bold text-navy text-xs uppercase tracking-wider">
              Payment Summary
            </h4>
            <div className="space-y-1.5">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span>
                <span className="font-medium text-navy">{formatMoney(order.subtotal)}</span>
              </div>
              {order.discount ? (
                <div className="flex justify-between text-green-700">
                  <span>Discount {order.couponCode ? `(${order.couponCode})` : ""}</span>
                  <span className="font-medium">-{formatMoney(order.discount)}</span>
                </div>
              ) : null}
              <div className="flex justify-between text-muted">
                <span>Shipping Fee</span>
                <span className="font-medium text-navy">
                  {order.shippingCost > 0 ? formatMoney(order.shippingCost) : "FREE"}
                </span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Est. Tax</span>
                <span className="font-medium text-navy">{formatMoney(order.tax)}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-line flex justify-between items-center text-sm font-bold text-navy">
              <span>Total Amount</span>
              <span className="text-base text-brand">{formatMoney(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 flex flex-wrap gap-3 border-t border-line pt-4">
          <button
            type="button"
            onClick={() => window.print()}
            className="btn btn-outline text-xs flex items-center gap-1.5"
          >
            <Printer size={14} /> Print Invoice
          </button>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-primary ml-auto text-xs"
          >
            Close Details
          </button>
        </div>
      </motion.div>
    </div>
  );
}
