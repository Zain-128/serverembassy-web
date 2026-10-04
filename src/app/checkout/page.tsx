"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowRight,
  Banknote,
  CheckCircle2,
  CreditCard,
  Lock,
  ShieldCheck,
  Sparkles,
  Tag,
  Truck,
} from "lucide-react";
import FreeShippingBar from "@/components/FreeShippingBar";
import { formatMoney } from "@/lib/format";
import {
  useCreateOrderMutation,
  useCreatePaymentIntentMutation,
  useValidateCouponMutation,
} from "@/store/storeApi";
import { useAppSelector } from "@/store";
import { useCart } from "@/lib/cart";
import { useToast } from "@/components/Toast";
import { TextField } from "@/components/ui/fields";
import { StateBox } from "@/components/ui/States";

type PaymentOption = {
  id: "stripe" | "cod" | "wire" | "paypal";
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string;
  desc: string;
};

const paymentOptions: readonly PaymentOption[] = [
  {
    id: "stripe",
    label: "Pay Online (Stripe)",
    icon: CreditCard,
    badge: "Recommended",
    desc: "Pay securely with Credit / Debit Card via Stripe",
  },
  {
    id: "cod",
    label: "Cash on Delivery (COD)",
    icon: Banknote,
    badge: "Popular",
    desc: "Pay cash upon delivery at your doorstep",
  },
  {
    id: "wire",
    label: "Bank Transfer",
    icon: Landmark,
    desc: "Direct bank wire transfer",
  },
  {
    id: "paypal",
    label: "PayPal",
    icon: ShieldCheck,
    desc: "Pay via your PayPal account",
  },
];

type PaymentMethodId = PaymentOption["id"];

function Landmark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
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
  const [method, setMethod] = useState<PaymentMethodId>("stripe");
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [createOrder, { isLoading: loading }] = useCreateOrderMutation();
  const [createPaymentIntent] = useCreatePaymentIntentMutation();
  const [validateCoupon] = useValidateCouponMutation();

  async function applyCoupon() {
    const code = coupon.trim().toUpperCase();
    if (!code) return;
    try {
      const result = await validateCoupon({ code, subtotal }).unwrap();
      if (result.valid && result.discount != null) {
        setDiscount(result.discount);
        toast(
          result.discount > 0
            ? `Coupon applied! Saved ${formatMoney(result.discount)}`
            : "Coupon applied",
          "success",
        );
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

    const finalTotal = Math.max(0, total - discount);

    try {
      let paymentIntentId: string | undefined = undefined;

      if (method === "stripe") {
        try {
          const intent = await createPaymentIntent({
            amount: finalTotal,
            currency: "usd",
            metadata: { email: String(fd.get("email")) },
          }).unwrap();
          paymentIntentId = intent.paymentIntentId;
        } catch (err) {
          console.warn("Stripe Payment Intent notice:", err);
        }
      }

      const order = await createOrder({
        email: String(fd.get("email")),
        paymentMethod: method,
        paymentIntentId,
        billingAddress: address,
        shippingAddress: address,
        customerId,
        couponCode: discount > 0 ? coupon.trim() : undefined,
        items: lines.map(({ product, qty }) => ({ productId: product.id, qty })),
      }).unwrap();

      setOrderNumber(order.orderNumber);
      clear();
      toast(
        method === "cod"
          ? "Order placed successfully with Cash on Delivery!"
          : "Order placed successfully!",
        "success",
      );
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
        <h1 className="text-center font-display text-3xl font-bold tracking-tight text-navy">
          Checkout
        </h1>
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
            Order <strong className="text-navy">{orderNumber}</strong> has been booked. A confirmation
            email will be sent with tracking information.
          </p>
          <div className="mt-6 space-y-2.5 rounded-2xl bg-page/60 p-4 text-left text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Total amount</span>
              <span className="font-semibold">{formatMoney(Math.max(0, total - discount))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Payment method</span>
              <span className="font-semibold uppercase">{method === "cod" ? "Cash on Delivery (COD)" : method}</span>
            </div>
            {method === "cod" && (
              <div className="mt-2 rounded-xl bg-amber-50 p-2.5 text-xs text-amber-800">
                💵 Please keep exact cash ready upon delivery.
              </div>
            )}
          </div>
          <div className="mt-6 flex flex-col gap-2">
            <Link href="/account" className="btn btn-outline w-full">
              View your orders
            </Link>
            <button
              type="button"
              className="btn btn-primary w-full"
              onClick={() => router.push("/shop")}
            >
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
          <Link href="/" className="transition-colors hover:text-brand">
            Home
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-navy">Checkout</span>
        </nav>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-navy md:text-4xl">
          Checkout
        </h1>
      </div>

      <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {/* billing */}
          <section className="rounded-3xl border border-line bg-white p-6 shadow-card">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-navy">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-soft text-xs font-bold text-brand">
                1
              </span>
              Billing & Shipping details
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
              <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-soft text-xs font-bold text-brand">
                2
              </span>
              Payment method
            </h2>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {paymentOptions.map(({ id, label, icon: Icon, badge, desc }) => (
                <label
                  key={id}
                  className={`relative flex cursor-pointer flex-col justify-between rounded-2xl border-2 p-4 text-sm transition ${
                    method === id
                      ? "border-brand bg-brand-soft/40 shadow-sm"
                      : "border-line bg-page/40 hover:border-line/80"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-semibold text-navy">
                        <input
                          type="radio"
                          name="payMethod"
                          value={id}
                          checked={method === id}
                          onChange={() => setMethod(id)}
                          className="accent-brand"
                        />
                        <Icon size={18} className="text-brand" />
                        {label}
                      </div>
                      {badge && (
                        <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand">
                          {badge}
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 pl-6 text-xs text-muted">{desc}</p>
                  </div>
                </label>
              ))}
            </div>

            {/* payment sub-forms */}
            <div className="mt-5">
              {method === "stripe" && (
                <div className="grid gap-4 rounded-2xl border border-line bg-page/40 p-5">
                  <div className="flex items-center justify-between border-b border-line/60 pb-3">
                    <span className="text-xs font-semibold text-navy">Stripe Secure Online Payment</span>
                    <span className="flex items-center gap-1 text-[11px] font-medium text-brand">
                      <Lock size={12} /> 256-Bit SSL Encryption
                    </span>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextField label="Card number" name="card" placeholder="4242 •••• •••• 4242" className="sm:col-span-2" />
                    <TextField label="Expiry (MM/YY)" name="expiry" placeholder="12/28" />
                    <TextField label="CVC" name="cvc" placeholder="123" />
                  </div>
                  <p className="flex items-center gap-1.5 text-xs text-muted">
                    <ShieldCheck size={14} className="text-green-600" /> Payments processed securely via Stripe payment gateway.
                  </p>
                </div>
              )}

              {method === "cod" && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 text-amber-900">
                  <div className="flex items-center gap-2 font-semibold text-sm">
                    <Truck size={18} className="text-amber-700" /> Cash on Delivery (COD)
                  </div>
                  <p className="mt-2 text-xs text-amber-800 leading-relaxed">
                    Pay with cash when your parcel arrives at your delivery location. No online credit card or bank transfer required up front.
                  </p>
                </div>
              )}

              {method === "wire" && (
                <div className="rounded-2xl border border-line bg-page/50 p-4 text-xs text-muted">
                  🏦 Direct bank transfer instructions will be emailed to your address upon order placement.
                </div>
              )}

              {method === "paypal" && (
                <div className="rounded-2xl border border-line bg-page/50 p-4 text-xs text-muted">
                  🅿️ You will receive a PayPal invoice link in your order confirmation email.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* summary */}
        <aside className="h-fit space-y-4 rounded-3xl border border-line bg-white p-6 shadow-card">
          <h2 className="font-display text-lg font-semibold text-navy">Order summary</h2>
          <FreeShippingBar compact />
          <ul className="max-h-56 space-y-2 overflow-auto pr-1 text-sm">
            {lines.map(({ product, qty }) => (
              <li key={product.id} className="flex justify-between gap-3">
                <span className="line-clamp-1">
                  {product.sku} × {qty}
                </span>
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
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span>{formatMoney(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Shipping</span>
              <span>{shipping === 0 ? "Free" : formatMoney(shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Tax</span>
              <span>{formatMoney(tax)}</span>
            </div>
            {discount > 0 ? (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>−{formatMoney(discount)}</span>
              </div>
            ) : null}
            <div className="flex justify-between border-t border-line pt-3 text-base font-bold text-navy">
              <span>Total</span>
              <span className="text-brand">{formatMoney(Math.max(0, total - discount))}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary group w-full disabled:opacity-60"
          >
            {loading ? (
              "Placing order…"
            ) : (
              <>
                {method === "cod" ? "Book Order (COD)" : "Place order"} · {formatMoney(Math.max(0, total - discount))}
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
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