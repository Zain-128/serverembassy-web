"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FreeShippingBar from "@/components/FreeShippingBar";
import { formatMoney } from "@/lib/format";
import { useCreateOrderMutation, useValidateCouponMutation } from "@/store/storeApi";
import { useAppSelector } from "@/store";
import { useCart } from "@/lib/cart";

export default function CheckoutPage() {
  const { lines, subtotal, shipping, tax, total, clear } = useCart();
  const customerId = useAppSelector((s) => s.auth.customer?.id);
  const router = useRouter();
  const [method, setMethod] = useState<"card" | "paypal" | "wire">("card");
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [createOrder, { isLoading: loading }] = useCreateOrderMutation();
  const [validateCoupon] = useValidateCouponMutation();

  async function applyCoupon() {
    setCouponError("");
    const code = coupon.trim();
    if (!code) return;
    try {
      const result = await validateCoupon({ code, subtotal }).unwrap();
      if (result.valid && result.discount != null) {
        setDiscount(result.discount);
        setCouponError("");
      } else {
        setDiscount(0);
        setCouponError(result.error ?? "Invalid coupon code");
      }
    } catch {
      setDiscount(0);
      setCouponError("Could not validate coupon. Is the API running?");
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const fd = new FormData(event.currentTarget);

    const address = {
      firstName: fd.get("firstName"),
      lastName: fd.get("lastName"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      company: fd.get("company"),
      address: fd.get("address"),
    };

    try {
      const order = await createOrder({
        email: String(fd.get("email")),
        paymentMethod: method,
        billingAddress: address,
        shippingAddress: address,
        customerId,
        couponCode: discount > 0 ? coupon.trim() : undefined,
        items: lines.map(({ product, qty }) => ({ productId: product.id, qty })),
      }).unwrap();
      setOrderNumber(order.orderNumber);
      clear();
    } catch (e) {
      const message =
        e && typeof e === "object" && "data" in e
          ? String((e as { data?: { error?: string } }).data?.error ?? "Checkout failed")
          : "Checkout failed. Is the API running?";
      setError(message);
    }
  }

  if (lines.length === 0 && !orderNumber) {
    return (
      <div className="container-se py-16 text-center">
        <p className="text-muted">Your cart is empty.</p>
        <Link href="/shop" className="btn btn-primary mt-4">
          Shop now
        </Link>
      </div>
    );
  }

  if (orderNumber) {
    return (
      <div className="container-se py-20 text-center">
        <h1 className="text-3xl font-bold text-navy">Order placed</h1>
        <p className="mt-2 text-muted">
          Order <strong>{orderNumber}</strong> confirmed. A confirmation will be sent to your email.
        </p>
        <button type="button" className="btn btn-primary mt-6" onClick={() => router.push("/shop")}>
          Continue shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container-se py-8">
      <h1 className="text-3xl font-bold text-navy">Checkout</h1>
      {error ? <p className="mt-2 text-sm text-sale">{error}</p> : null}
      <form onSubmit={onSubmit} className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr_320px]">
        <section className="rounded-2xl bg-white p-6 ring-1 ring-line">
          <h2 className="font-semibold">Billing details</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              ["firstName", "First name"],
              ["lastName", "Last name"],
              ["email", "Email"],
              ["phone", "Phone"],
              ["company", "Company"],
              ["address", "Address"],
            ].map(([name, label]) => (
              <label key={name} className="text-sm">
                {label}
                <input
                  name={name}
                  required={name !== "company"}
                  type={name === "email" ? "email" : "text"}
                  className="mt-1 w-full rounded-lg border border-line px-3 py-2"
                />
              </label>
            ))}
          </div>
        </section>
        <section className="rounded-2xl bg-white p-6 ring-1 ring-line">
          <h2 className="font-semibold">Payment method</h2>
          <div className="mt-4 space-y-2 text-sm">
            {(
              [
                ["card", "Credit / Debit Card"],
                ["paypal", "PayPal"],
                ["wire", "Bank Transfer"],
              ] as const
            ).map(([id, label]) => (
              <label key={id} className="flex items-center gap-2 rounded-lg border border-line p-3">
                <input
                  type="radio"
                  name="pay"
                  checked={method === id}
                  onChange={() => setMethod(id)}
                />
                {label}
              </label>
            ))}
          </div>
          {method === "card" ? (
            <div className="mt-4 grid gap-3">
              <input required placeholder="Card number" className="rounded-lg border border-line px-3 py-2" />
              <div className="grid grid-cols-2 gap-3">
                <input required placeholder="MM/YY" className="rounded-lg border border-line px-3 py-2" />
                <input required placeholder="CVC" className="rounded-lg border border-line px-3 py-2" />
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">
              Instructions will be emailed after you place the order.
            </p>
          )}
        </section>
        <aside className="h-fit space-y-4 rounded-2xl bg-white p-5 ring-1 ring-line">
          <h2 className="font-semibold">Order summary</h2>
          <FreeShippingBar compact />
          <ul className="space-y-2 text-sm">
            {lines.map(({ product, qty }) => (
              <li key={product.id} className="flex justify-between gap-3">
                <span className="line-clamp-1">
                  {product.sku} × {qty}
                </span>
                <span>{formatMoney(product.price * qty)}</span>
              </li>
            ))}
          </ul>
          <div className="space-y-2 border-t border-line pt-3">
            <label className="text-sm">
              <span className="font-medium">Promo code</span>
              <div className="mt-1 flex gap-2">
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                  placeholder="e.g. SAVE10"
                  className="w-full rounded-lg border border-line px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  disabled={!coupon.trim()}
                  className="shrink-0 rounded-lg border border-line px-3 py-2 text-sm font-semibold disabled:opacity-50"
                >
                  Apply
                </button>
              </div>
              {couponError ? <span className="mt-1 block text-xs text-sale">{couponError}</span> : null}
            </label>
          </div>
          <div className="space-y-1 border-t border-line pt-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatMoney(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : formatMoney(shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>{formatMoney(tax)}</span>
            </div>
            {discount > 0 ? (
              <div className="flex justify-between text-brand">
                <span>Discount</span>
                <span>−{formatMoney(discount)}</span>
              </div>
            ) : null}
            <div className="flex justify-between pt-1 text-base font-bold">
              <span>Total</span>
              <span>{formatMoney(total - discount)}</span>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary w-full disabled:opacity-60">
            {loading ? "Placing order…" : "Place order"}
          </button>
        </aside>
      </form>
    </div>
  );
}
