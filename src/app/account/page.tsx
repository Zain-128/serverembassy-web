"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatMoney } from "@/lib/format";
import { Skeleton } from "@/components/Skeleton";
import Pagination from "@/components/Pagination";
import { useAppSelector, useAppDispatch } from "@/store";
import { logout } from "@/store/authSlice";
import { useGetMeQuery, useLogoutMutation } from "@/store/authApi";
import { useGetMyOrdersQuery } from "@/store/storeApi";

export default function AccountPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const token = useAppSelector((s) => s.auth.token);
  const [doLogout] = useLogoutMutation();
  const [page, setPage] = useState(1);
  const { data: customer, isLoading: loadingCustomer } = useGetMeQuery(undefined, { skip: !token });
  const { data: ordersResult, isLoading: loadingOrders } = useGetMyOrdersQuery(
    { page },
    { skip: !token },
  );

  useEffect(() => {
    if (token && !loadingCustomer && !customer) {
      dispatch(logout());
      router.replace("/login");
    }
  }, [token, loadingCustomer, customer, router, dispatch]);

  if (!token) {
    return (
      <div className="container-se py-16 text-center">
        <h1 className="text-2xl font-bold text-navy">Sign in required</h1>
        <p className="mt-2 text-muted">
          <Link href="/login" className="text-brand underline">Log in</Link> to view your orders.
        </p>
      </div>
    );
  }

  const loading = loadingCustomer || loadingOrders;

  return (
    <div className="container-se grid gap-8 py-8 lg:grid-cols-[240px_1fr]">
      <aside className="h-fit rounded-2xl bg-white p-4 ring-1 ring-line">
        <p className="px-2 text-xs font-semibold uppercase tracking-wide text-muted">Account</p>
        <nav className="mt-2 flex flex-col text-sm">
          <Link href="/account" className="rounded-lg bg-brand-soft px-3 py-2 font-medium text-brand">
            Dashboard
          </Link>
          <Link href="/account" className="rounded-lg px-3 py-2 hover:bg-page">
            Orders
          </Link>
          <Link href="/account" className="rounded-lg px-3 py-2 hover:bg-page">
            Account details
          </Link>
          <button
            type="button"
            onClick={() => doLogout()}
            className="rounded-lg px-3 py-2 text-left hover:bg-page"
          >
            Log out
          </button>
        </nav>
      </aside>
      <div>
        <h1 className="text-3xl font-bold text-navy">
          {customer?.fullName ? `Hello, ${customer.fullName.split(" ")[0]}` : "Your account"}
        </h1>
        <p className="mt-1 text-muted">
          {customer?.email}
          {customer?.company ? ` · ${customer.company}` : ""}
        </p>
        {customer && (
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              [String(ordersResult?.total ?? 0), "Orders"],
              ["0", "Open RMA"],
              [customer.taxExempt === "approved" ? "Approved" : "—", "Tax exempt"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl bg-white p-5 ring-1 ring-line">
                <p className="text-2xl font-bold text-navy">{value}</p>
                <p className="text-sm text-muted">{label}</p>
              </div>
            ))}
          </div>
        )}
        <div className="mt-8 rounded-2xl bg-white ring-1 ring-line">
          <div className="border-b border-line px-5 py-3 font-semibold">Recent orders</div>
          {loading ? (
            <div className="divide-y divide-line">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="px-5 py-3">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="mt-2 h-3 w-20" />
                </div>
              ))}
            </div>
          ) : ordersResult && ordersResult.items.length ? (
            <>
              <div className="divide-y divide-line">
                {ordersResult.items.map((order) => (
                  <div key={order.id} className="flex items-center justify-between gap-3 px-5 py-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{order.orderNumber}</p>
                      <p className="text-xs text-muted">
                        {new Date(order.placedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatMoney(order.total)}</p>
                      <p className="text-xs capitalize text-muted">{order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Pagination
                page={page}
                totalPages={ordersResult.totalPages}
                onChange={(p) => setPage(p)}
                className="px-5"
              />
            </>
          ) : (
            <p className="px-5 py-8 text-sm text-muted">
              No orders yet.{" "}
              <Link href="/shop" className="text-brand underline">Start shopping</Link>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}