"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  AlertTriangle, ArrowRight, ChevronRight, LayoutDashboard, LogOut, MessageSquareQuote,
  Package, ShoppingBag, UserPlus, Users, X,
} from "lucide-react";
import { formatMoney } from "@/lib/format";
import { Skeleton } from "@/components/Skeleton";
import Pagination from "@/components/Pagination";
import { useToast, getErrorMessage } from "@/components/Toast";
import { useAppSelector, useAppDispatch } from "@/store";
import { logout } from "@/store/authSlice";
import { useGetMeQuery, useLogoutMutation, useDeleteAccountMutation, useGetMyInvitesQuery } from "@/store/authApi";
import { useGetMyOrdersQuery } from "@/store/storeApi";

function DeleteAccountModal({ onClose }: { onClose: () => void }) {
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [deleteAccount, { isLoading }] = useDeleteAccountMutation();
  const { toast } = useToast();
  const router = useRouter();

  const canDelete = confirmText === "DELETE";

  const handleDelete = async () => {
    try {
      await deleteAccount({ password }).unwrap();
      toast("Your account has been deleted", "success");
      router.replace("/");
    } catch (err) {
      toast(getErrorMessage(err, "Could not delete account."), "error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <motion.div
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-lift"
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-red-50 text-red-600">
              <AlertTriangle size={20} />
            </span>
            <div>
              <h3 className="font-display font-bold text-navy">Delete account</h3>
              <p className="text-sm text-muted">This action is permanent.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-muted hover:bg-page"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 space-y-2 rounded-2xl bg-red-50 p-4 text-sm text-red-800">
          <p>Deleting your account will:</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>Permanently remove your account</li>
            <li>Anonymize your order history (PII removed)</li>
            <li>Remove all your invites</li>
          </ul>
        </div>

        <label className="mt-4 block text-sm font-medium">
          Enter your password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="mt-1 w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-200"
          />
        </label>

        <label className="mt-3 block text-sm font-medium">
          Type <span className="font-bold">DELETE</span> to confirm
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE"
            className="mt-1 w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-200"
          />
        </label>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl bg-page px-4 py-2.5 text-sm font-semibold text-navy transition hover:bg-line/60"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canDelete || isLoading || !password}
            onClick={handleDelete}
            className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isLoading ? "Deleting…" : "Delete account"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

const navItems = [
  { href: "/account", label: "Dashboard", icon: LayoutDashboard, active: true },
  { href: "/account#orders", label: "Orders", icon: Package },
  { href: "/invite", label: "Invite friends", icon: Users },
  { href: "/contact", label: "Request a quote", icon: MessageSquareQuote },
];

export default function AccountPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const token = useAppSelector((s) => s.auth.token);
  const [doLogout] = useLogoutMutation();
  const [page, setPage] = useState(1);
  const [showDelete, setShowDelete] = useState(false);
  const { data: customer, isLoading: loadingCustomer } = useGetMeQuery(undefined, { skip: !token });
  const { data: ordersResult, isLoading: loadingOrders } = useGetMyOrdersQuery(
    { page },
    { skip: !token },
  );
  const { data: invitesResult } = useGetMyInvitesQuery(undefined, { skip: !token });

  useEffect(() => {
    if (token && !loadingCustomer && !customer) {
      dispatch(logout());
      router.replace("/login");
    }
  }, [token, loadingCustomer, customer, router, dispatch]);

  if (!token) {
    return (
      <div className="container-se py-16 text-center">
        <div className="mx-auto max-w-md rounded-3xl border border-line bg-white p-10 shadow-card">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-soft text-brand">
            <LayoutDashboard size={26} />
          </span>
          <h1 className="mt-5 font-display text-2xl font-bold text-navy">Sign in required</h1>
          <p className="mt-2 text-sm text-muted">
            Log in to view your dashboard, orders, and invites.
          </p>
          <Link href="/login" className="btn btn-primary mt-6 w-full">
            Log in <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  const loading = loadingCustomer || loadingOrders;

  return (
    <div className="container-se grid gap-8 py-8 lg:grid-cols-[240px_1fr]">
      {/* sidebar */}
      <aside className="h-fit rounded-3xl border border-line bg-white p-3 shadow-card">
        <div className="rounded-2xl bg-gradient-to-br from-navy to-navy-mid p-4 text-white">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-soft text-sm font-bold text-navy">
              {(customer?.fullName?.[0] ?? customer?.email?.[0] ?? "U").toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{customer?.fullName ?? "Account"}</p>
              <p className="truncate text-xs text-white/60">{customer?.email}</p>
            </div>
          </div>
        </div>
        <nav className="mt-3 flex flex-col gap-0.5 text-sm">
          {navItems.map((ni) => (
            <Link
              key={ni.href}
              href={ni.href}
              className="group flex items-center gap-2.5 rounded-xl px-3 py-2.5 font-medium transition hover:bg-page"
            >
              <ni.icon size={16} className="text-brand" />
              {ni.label}
              <ChevronRight size={14} className="ml-auto text-muted transition group-hover:translate-x-0.5" />
            </Link>
          ))}
          <button
            type="button"
            onClick={() => doLogout()}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left font-medium text-muted transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={16} /> Log out
          </button>
        </nav>
      </aside>

      <div>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-navy">
              {customer?.fullName ? `Welcome, ${customer.fullName.split(" ")[0]}` : "Your account"}
            </h1>
            <p className="mt-1 text-muted">
              {customer?.email}
              {customer?.company ? ` · ${customer.company}` : ""}
            </p>
          </div>
          <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
            {customer?.taxExempt === "approved" ? "Tax exempt approved" : "Standard account"}
          </span>
        </div>

        {customer && (
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {(
              [
                {
                  label: "Orders",
                  value: String(ordersResult?.total ?? 0),
                  icon: Package as typeof Package,
                },
                {
                  label: "Friend invites",
                  value: String(invitesResult?.inviteCount ?? 0),
                  icon: Users as typeof Package,
                },
                {
                  label: "Tax exempt",
                  value: customer.taxExempt === "approved" ? "Approved" : "—",
                  icon: MessageSquareQuote as typeof Package,
                },
              ] as const
            ).map(({ label, value, icon: Icon }) => (
              <div key={label} className="group rounded-3xl border border-line bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted">{label}</p>
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-soft text-brand">
                    <Icon size={16} />
                  </span>
                </div>
                <p className="mt-2 font-display text-2xl font-bold text-navy">{value}</p>
              </div>
            ))}
          </div>
        )}

        {customer && (
          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-3xl border border-brand/20 bg-gradient-to-r from-brand-soft/40 to-white p-5">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand text-white">
              <UserPlus size={20} />
            </span>
            <p className="flex-1 text-sm text-navy">
              Know someone using server hardware? Invite them and track who brings the most friends.
            </p>
            <Link href="/invite" className="btn btn-primary">Invite friends</Link>
          </div>
        )}

        {/* orders */}
        <div id="orders" className="mt-8 overflow-hidden rounded-3xl border border-line bg-white shadow-card">
          <div className="flex items-center justify-between border-b border-line bg-gradient-to-br from-brand-soft/40 to-transparent px-6 py-4">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-navy">
              <ShoppingBag size={18} className="text-brand" /> Recent orders
            </h2>
          </div>
          {loading ? (
            <div className="divide-y divide-line">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="px-6 py-4">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="mt-2 h-3 w-20" />
                </div>
              ))}
            </div>
          ) : ordersResult && ordersResult.items.length ? (
            <>
              <div className="divide-y divide-line">
                {ordersResult.items.map((order) => (
                  <div key={order.id} className="flex items-center justify-between gap-3 px-6 py-4 transition hover:bg-page/50">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-navy">{order.orderNumber}</p>
                      <p className="text-xs text-muted">
                        {new Date(order.placedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-navy">{formatMoney(order.total)}</p>
                      <span
                        className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${
                          order.status === "delivered"
                            ? "bg-green-50 text-green-700"
                            : order.status === "processing"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-sky-50 text-sky-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Pagination
                page={page}
                totalPages={ordersResult.totalPages}
                onChange={(p) => setPage(p)}
                className="px-6"
              />
            </>
          ) : (
            <div className="px-6 py-10 text-center">
              <p className="text-sm text-muted">
                No orders yet.{" "}
                <Link href="/shop" className="font-semibold text-brand underline">Start shopping</Link>.
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 rounded-3xl border border-red-100 bg-white p-6 shadow-card ring-1 ring-red-50">
          <h3 className="font-display text-lg font-bold text-red-700">Danger zone</h3>
          <p className="mt-1 text-sm text-muted">
            Permanently delete your account. Your order history will be anonymized and your invites removed.
          </p>
          <button
            type="button"
            onClick={() => setShowDelete(true)}
            className="mt-4 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            Delete account
          </button>
        </div>
      </div>

      {showDelete && <DeleteAccountModal onClose={() => setShowDelete(false)} />}
    </div>
  );
}