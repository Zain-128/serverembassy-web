"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle2, CreditCard, Lock, ShieldCheck, Sparkles, Tag } from "lucide-react";
import FreeShippingBar from "@/components/FreeShippingBar";
import { formatMoney } from "@/lib/format";
import { useCreateOrderMutation, useValidateCouponMutation } from "@/store/storeApi";
import { useAppSelector } from "@/store";
import { useCart } from "@/lib/cart";
import { useToast } from "@/components/Toast";
import { TextField } from "@/components/ui/fields";
import { StateBox } from "@/components/ui/States";

const paymentOptions = [
  { id: "card", label: "Credit / Debit Card", icon: CreditCard },
  { id: "paypal", label: "PayPal", icon: ShieldCheck },
  { id: "wire", label: "Bank Transfer", icon: Landmark },
] as const;

function Landmark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 21h18M17 21v-8m-4 8v-8m-4 8v-8M3 17l.5-11L12 3l8.5 3L21 17" />
      <path d="M12 3v0" />
    </svg>
  );
}

export default function CheckoutPage() {
  const { lines, subtotal, shipping, tax, total, clear } = useCart();
  const customerId = useAppSelector((s) => s.auth.customer?.id);
  const router = useRouter();
  const toast = useToast().toast;
  const [method, setMethod] = useState<"card" | "paypal" | "wire">("card");
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [createOrder, { isLoading: loading }] = useCreateOrderMutation();
  const [validateCoupon] = useValidateCouponMutation();

  async function applyCoupon() {
    const code = coupon.trim().toUpperCase();
    if (!code) return;
    try {
      const result = await validateCoupon({ code, subtotal }).unwrap();
      if (result.valid && result.discount != null) {
        setDiscount(result.discount);
        toast(result.discount > 0 ? `Coupon applied! Saved ${formatMoney(result.discount)}` : "Coupon applied", "success");
      } else {
        setDiscount(0);
        toast(result.error ?? "Invalid coupon code", "error");
      }
    } catch {
      setDiscount(0);
      toast("Could not validate coupon. Is the API running?", "error");
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
      toast("Order placed successfully!", "success");
    } catch (e) {
      const message =
        e && typeof e === "object" && "data" in e
          ? String((e as { data?: { error?: string } }).data?.error ?? "Checkout failed")
          : "Checkout failed. Is the API running?";
      toast(message, "error");
    }
  }

  if (lines.length === 0 && !orderNumber) {
    return (
      <div className="container-se py-16">
        <h1 className="text-center font-display text-3xl font-bold tracking-tight text-navy">Checkout</h1>
        <div className="mt-8">
          <StateBox
            icon={<CreditCard size={26} />}
            title="Your cart is empty"
            body="Add some hardware to your cart before checking out."
            cta={{ label: "Shop now", href: "/shop" }}
          />
        </div>
      </div>
    );
  }

  if (orderNumber) {
    return (
      <div className="container-se py-16">
        <motion.div
          className="mx-auto max-w-md rounded-3xl border border-line bg-white p-10 text-center shadow-card"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-green-50 text-green-600">
            <CheckCircle2 size={30} />
          </div>
          <h1 className="mt-5 font-display text-2xl font-bold text-navy">Order confirmed!</h1>
          <p className="mt-2 text-sm text-muted">
            Order <strong className="text-navy">{orderNumber}</strong> has been placed. A confirmation
            will be sent to your email with tracking once it ships.
          </p>
          <div className="mt-6 space-y-2 rounded-2xl bg-page/60 p-4 text-left text-sm">
            <div className="flex justify-between"><span className="text-muted">Total paid</span><span className="font-semibold">{formatMoney(total - discount)}</span></div>
            <div className="flex justify-between"><span className="text-muted">Payment</span><span className="font-semibold capitalize">{method}</span></div>
          </div>
          <div className="mt-6 flex flex-col gap-2">
            <Link href="/account" className="btn btn-outline w-full">View your orders</Link>
            <button type="button" className="btn btn-primary w-full" onClick={() => router.push("/shop")}>
              Continue shopping <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container-se py-8">
      <div className="mb-6 border-b border-line pb-6">
<nav className="text-xs text-muted">
          <Link href="/" className="transition-colors hover:text-brand">Home</Link>
          <span className="mx-1.5">/</span>
          <span className="text-navy">Checkout</span>
        </nav>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-navy md:text-4xl">Checkout</h1>
      </div>

      <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {/* billing */}
          <section className="rounded-3xl border border-line bg-white p-6 shadow-card">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-navy">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-soft text-xs font-bold text-brand">1</span>
              Billing details
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <TextField label="First name" name="firstName" required placeholder="Jane" />
              <TextField label="Last name" name="lastName" required placeholder="Doe" />
              <TextField label="Email" name="email" type="email" required placeholder="jane@company.com" />
              <TextField label="Phone" name="phone" required placeholder="+1 555 000 1234" />
              <TextField label="Company" name="company" placeholder="Optional" />
              <TextField label="Address" name="address" required placeholder="Street, city, postal code" />
            </div>
          </section>

          {/* payment */}
          <section className="rounded-3xl border border-line bg-white p-6 shadow-card">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-navy">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-soft text-xs font-bold text-brand">2</span>
              Payment method
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {paymentOptions.map(({ id, label, icon: Icon }) => (
                <label
                  key={id}
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 text-sm transition ${
                    method === id
                      ? "border-brand bg-brand-soft/40"
                      : "border-line bg-page/40 hover:border-line/60"
                  }`}
                >
                  <input
                    type="radio"
                    name="pay"
                    checked={method === id}
                    onChange={() => setMethod(id)}
                    className="accent-brand"
                  />
                  <Icon size={18} className="text-brand" />
                  {label}
                </label>
              ))}
            </div>
            {method === "card" ? (
              <div className="mt-5 grid gap-4 rounded-2xl border border-line bg-page/40 p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField label="Card number" name="card" placeholder="4242 4242 4242 4242" className="sm:col-span-2" />
                  <TextField label="Expiry (MM/YY)" name="expiry" placeholder="12/28" />
                  <TextField label="CVC" name="cvc" placeholder="123" />
                </div>
                <p className="flex items-center gap-1.5 text-xs text-muted">
                  <Lock size={12} /> This demo does not process real payments.
                </p>
              </div>
            ) : (
              <p className="mt-4 rounded-xl bg-page/50 p-3 text-sm text-muted">
                {method === "wire"
                  ? "Bank transfer instructions will be emailed after you place the order."
                  : "You'll be redirected to PayPal to complete your purchase."}
              </p>
            )}
          </section>
        </div>

        {/* summary */}
        <aside className="h-fit space-y-4 rounded-3xl border border-line bg-white p-6 shadow-card">
          <h2 className="font-display text-lg font-semibold text-navy">Order summary</h2>
          <FreeShippingBar compact />
          <ul className="max-h-56 space-y-2 overflow-auto pr-1 text-sm">
            {lines.map(({ product, qty }) => (
              <li key={product.id} className="flex justify-between gap-3">
                <span className="line-clamp-1">{product.sku} × {qty}</span>
                <span className="font-medium">{formatMoney(product.price * qty)}</span>
              </li>
            ))}
          </ul>

          {/* coupon */}
          <div className="rounded-2xl border border-dashed border-line bg-page/40 p-4">
            <label className="flex items-center gap-1.5 text-sm font-medium text-navy">
              <Tag size={14} className="text-brand" /> Promo code
            </label>
            <div className="mt-2 flex gap-2">
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                placeholder="e.g. SAVE10"
                className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm uppercase outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
              <button
                type="button"
                onClick={applyCoupon}
                disabled={!coupon.trim()}
                className="shrink-0 rounded-xl border border-brand px-4 py-2 text-sm font-semibold text-brand transition hover:bg-brand hover:text-white disabled:opacity-40"
              >
                Apply
              </button>
            </div>
            {discount > 0 ? (
              <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-green-600">
                <Sparkles size={12} /> {formatMoney(discount)} off applied
              </p>
            ) : null}
          </div>

          <div className="space-y-2.5 border-t border-line pt-4 text-sm">
            <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>{formatMoney(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted">Shipping</span><span>{shipping === 0 ? "Free" : formatMoney(shipping)}</span></div>
            <div className="flex justify-between"><span className="text-muted">Tax</span><span>{formatMoney(tax)}</span></div>
            {discount > 0 ? (
              <div className="flex justify-between text-green-600"><span>Discount</span><span>−{formatMoney(discount)}</span></div>
            ) : null}
            <div className="flex justify-between border-t border-line pt-3 text-base font-bold text-navy">
              <span>Total</span>
              <span className="text-brand">{formatMoney(total - discount)}</span>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary group w-full disabled:opacity-60">
            {loading ? (
              "Placing order…"
            ) : (
              <>
                Place order · {formatMoney(total - discount)}
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </>
            )}
          </button>
          <p className="flex items-center justify-center gap-1.5 text-xs text-muted">
            <Lock size={12} /> Secure & encrypted checkout
          </p>
          <Link href="/cart" className="block text-center text-xs text-muted underline hover:text-brand">
            Back to cart
          </Link>
        </aside>
      </form>
    </div>
  );
}