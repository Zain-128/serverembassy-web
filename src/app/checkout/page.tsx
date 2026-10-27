"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Landmark,
  Lock,
  ShieldCheck,
  Sparkles,
  Tag,
} from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import FreeShippingBar from "@/components/FreeShippingBar";
import { formatMoney } from "@/lib/format";
import {
  useCreateOrderMutation,
  useCreatePaymentIntentMutation,
  useValidateCouponMutation,
} from "@/store/storeApi";
import { useAppSelector } from "@/store";
import type { CustomerOrder } from "@/types/store";
import { useCart } from "@/lib/cart";
import { useToast } from "@/components/Toast";
import { TextField } from "@/components/ui/fields";
import { StateBox } from "@/components/ui/States";

const stripePublishableKey =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
  "pk_test_51R43eyA23918KXk8Ap5QD7vlZ1OlLHekYx1ioxYWDHSKVdS0m9DxZUbA9G3kmMwuPc1HQXP1CGfT5oJH2EB8Lqz400o8shus1V";

const stripePromise = loadStripe(stripePublishableKey);

type PaymentOption = {
  id: "stripe" | "wire";
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string;
  desc: string;
};

const paymentOptions: readonly PaymentOption[] = [
  {
    id: "stripe",
    label: "Credit / Debit Card (Stripe)",
    icon: CreditCard,
    badge: "Instant Confirmation",
    desc: "Pay securely with Visa, MasterCard, Amex, or Discover via Stripe 256-bit encryption.",
  },
  {
    id: "wire",
    label: "Bank Wire / ACH Transfer (B2B)",
    icon: Landmark,
    badge: "Enterprise",
    desc: "Corporate ACH or domestic/international bank wire. Pro-forma invoice & wiring coordinates generated upon order.",
  },
];

type PaymentMethodId = PaymentOption["id"];

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { lines, subtotal, shipping, tax, total, clear } = useCart();
  const loggedInCustomer = useAppSelector((s) => s.auth.customer);
  const customerId = loggedInCustomer?.id;
  const router = useRouter();
  const toast = useToast().toast;

  const [method, setMethod] = useState<PaymentMethodId>("stripe");
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [bookedOrder, setBookedOrder] = useState<CustomerOrder | null>(null);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [createAccount, setCreateAccount] = useState(true);
  const [accountPassword, setAccountPassword] = useState("");
  const [processing, setProcessing] = useState(false);

  const [createOrder, { isLoading: creatingOrder }] = useCreateOrderMutation();
  const [createPaymentIntent] = useCreatePaymentIntentMutation();
  const [validateCoupon] = useValidateCouponMutation();

  const loading = processing || creatingOrder;

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

    const email = String(fd.get("email") ?? "").trim();
    const firstName = String(fd.get("firstName") ?? "").trim();
    const lastName = String(fd.get("lastName") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();
    const company = String(fd.get("company") ?? "").trim();
    const streetAddress = String(fd.get("address") ?? "").trim();

    if (!email || !firstName || !streetAddress) {
      toast("Please complete all required shipping fields.", "error");
      return;
    }

    const address = {
      firstName,
      lastName,
      email,
      phone,
      company,
      address: streetAddress,
    };

    const finalTotal = Math.max(0, total - discount);
    setProcessing(true);

    try {
      let paymentIntentId: string | undefined = undefined;

      if (method === "stripe") {
        if (!stripe || !elements) {
          toast("Stripe is still initializing. Please try again in a moment.", "error");
          setProcessing(false);
          return;
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          toast("Please enter your card details.", "error");
          setProcessing(false);
          return;
        }

        // 1. Create PaymentIntent on server
        const intentRes = await createPaymentIntent({
          amount: finalTotal,
          currency: "usd",
          metadata: {
            email,
            customerName: `${firstName} ${lastName}`.trim(),
          },
        }).unwrap();

        if (!intentRes.clientSecret) {
          throw new Error("Unable to initialize secure payment intent.");
        }

        // 2. Confirm card payment directly with Stripe
        const confirmResult = await stripe.confirmCardPayment(intentRes.clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: `${firstName} ${lastName}`.trim(),
              email,
              phone: phone || undefined,
              address: {
                line1: streetAddress,
              },
            },
          },
        });

        if (confirmResult.error) {
          toast(confirmResult.error.message || "Payment confirmation failed.", "error");
          setProcessing(false);
          return;
        }

        if (confirmResult.paymentIntent?.status !== "succeeded") {
          toast("Payment was not completed. Please try again.", "error");
          setProcessing(false);
          return;
        }

        paymentIntentId = confirmResult.paymentIntent.id;
      }

      // 3. Create verified order in API
      const order = await createOrder({
        email,
        paymentMethod: method === "stripe" ? "card" : "wire",
        paymentIntentId,
        billingAddress: address,
        shippingAddress: address,
        customerId,
        createAccount: loggedInCustomer ? undefined : createAccount,
        password: accountPassword.trim() || undefined,
        couponCode: discount > 0 ? coupon.trim() : undefined,
        items: lines.map(({ product, qty }) => ({ productId: product.id, qty })),
      }).unwrap();

      setBookedOrder(order);
      setOrderNumber(order.orderNumber);
      clear();

      toast(
        method === "wire"
          ? "Order placed! Pro-forma wire invoice generated."
          : "Payment successful! Order confirmed.",
        "success",
      );
    } catch (e: unknown) {
      console.error("Checkout error:", e);
      const message =
        e && typeof e === "object" && "data" in e
          ? String((e as { data?: { error?: string } }).data?.error ?? "Checkout failed")
          : e instanceof Error
            ? e.message
            : "Checkout failed. Please verify your details.";
      toast(message, "error");
    } finally {
      setProcessing(false);
    }
  }

  if (lines.length === 0 && !orderNumber && !bookedOrder) {
    return (
      <div className="container-se py-16">
        <h1 className="text-center font-display text-3xl font-bold tracking-tight text-navy">
          Checkout
        </h1>
        <div className="mt-8">
          <StateBox
            icon={<CreditCard size={26} />}
            title="Your cart is empty"
            body="Add enterprise hardware to your cart before checking out."
            cta={{ label: "Shop Hardware", href: "/shop" }}
          />
        </div>
      </div>
    );
  }

  if (orderNumber || bookedOrder) {
    const displayTotal = bookedOrder ? bookedOrder.total : Math.max(0, total - discount);
    const displayMethod = bookedOrder ? bookedOrder.paymentMethod : method;
    const displayStatus = bookedOrder ? bookedOrder.paymentStatus : (displayMethod === "wire" ? "pending" : "paid");

    return (
      <div className="container-se py-16">
        <motion.div
          className="mx-auto max-w-lg rounded-3xl border border-line bg-white p-8 sm:p-10 text-center shadow-card"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-green-50 text-green-600">
            <CheckCircle2 size={32} />
          </div>
          <h1 className="mt-5 font-display text-2xl font-bold text-navy">Order Confirmed!</h1>
          <p className="mt-2 text-sm text-muted">
            Order <strong className="text-navy">{orderNumber || bookedOrder?.orderNumber}</strong> has been successfully booked. A confirmation
            email with invoice and tracking details has been sent.
          </p>

          <div className="mt-6 space-y-2.5 rounded-2xl bg-page/60 p-5 text-left text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Total amount</span>
              <span className="font-semibold text-navy">{formatMoney(displayTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Payment method</span>
              <span className="font-semibold uppercase text-navy">
                {displayMethod === "wire" ? "Bank Wire / ACH" : "Credit / Debit Card (Stripe)"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Payment status</span>
              <span className={`font-semibold capitalize ${displayStatus === "paid" ? "text-green-700" : "text-amber-700"}`}>
                {displayStatus}
              </span>
            </div>

            {displayMethod === "wire" && (
              <div className="mt-4 rounded-xl bg-blue-50/80 border border-blue-200 p-4 text-xs text-blue-900 space-y-1.5">
                <p className="font-bold flex items-center gap-1.5 text-blue-950">
                  <Landmark size={15} className="text-[#0066ff]" /> Wire & ACH Transfer Coordinates
                </p>
                <p className="text-blue-800 leading-relaxed">
                  Beneficiary: <strong>Power Line Devices</strong><br />
                  Memo / Reference: <strong>{orderNumber || bookedOrder?.orderNumber}</strong><br />
                  Our finance team has emailed the full bank wire package. Your hardware will be reserved upon receipt.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-2.5">
            <Link href="/account" className="btn btn-outline w-full">
              View Your Orders
            </Link>
            <button
              type="button"
              className="btn btn-primary w-full"
              onClick={() => router.push("/shop")}
            >
              Continue Shopping <ArrowRight size={16} />
            </button>
          </div>

          <p className="mt-5 text-xs text-muted">
            Questions regarding this order? Direct line:{" "}
            <a href="tel:+13217885899" className="font-semibold text-navy hover:text-[#0066ff]">
              (321) 788-5899
            </a>{" "}
            or email{" "}
            <a href="mailto:info@powerlinedevices.com" className="font-semibold text-navy hover:text-[#0066ff]">
              info@powerlinedevices.com
            </a>
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container-se py-10">
      <h1 className="font-display text-3xl font-bold tracking-tight text-navy md:text-4xl">
        Secure Checkout
      </h1>

      <form onSubmit={onSubmit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {/* Shipping Address */}
          <section className="rounded-3xl border border-line bg-white p-6 shadow-card">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-navy">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-soft text-xs font-bold text-brand">
                1
              </span>
              Shipping & Customer Information
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <TextField label="First name" name="firstName" required placeholder="Jane" defaultValue={loggedInCustomer?.fullName?.split(" ")[0] || ""} />
              <TextField label="Last name" name="lastName" placeholder="Doe" defaultValue={loggedInCustomer?.fullName?.split(" ").slice(1).join(" ") || ""} />
              <TextField label="Company (Optional)" name="company" placeholder="Acme Enterprise Inc." defaultValue={loggedInCustomer?.company || ""} />
              <TextField label="Phone" name="phone" required placeholder="(321) 555-0199" defaultValue={loggedInCustomer?.phone || ""} />
              <TextField label="Email address" name="email" type="email" required placeholder="jane@enterprise.com" className="sm:col-span-2" defaultValue={loggedInCustomer?.email || ""} />
              <TextField label="Street Address" name="address" required placeholder="123 Technology Park Blvd, Suite 400" className="sm:col-span-2" />
            </div>

            {/* Account Creation Options */}
            <div className="mt-5 border-t border-line/60 pt-4">
              {loggedInCustomer ? (
                <div className="flex items-center gap-2 text-xs text-brand font-medium">
                  <ShieldCheck size={16} /> Signed in as <strong>{loggedInCustomer.email}</strong>. Order will be automatically linked to your account.
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-xs font-medium text-navy cursor-pointer">
                    <input
                      type="checkbox"
                      checked={createAccount}
                      onChange={(e) => setCreateAccount(e.target.checked)}
                      className="accent-brand rounded"
                    />
                    <span>Create a customer account with this email for tracking & invoice history</span>
                  </label>

                  {createAccount && (
                    <div className="pt-1">
                      <label className="block text-xs font-medium text-navy/70 mb-1">
                        Account Password <span className="text-muted font-normal">(Optional — leave blank to auto-generate)</span>
                      </label>
                      <input
                        type="password"
                        value={accountPassword}
                        onChange={(e) => setAccountPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-line bg-white px-3.5 py-2 text-xs outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Payment Method */}
          <section className="rounded-3xl border border-line bg-white p-6 shadow-card">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-navy">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-soft text-xs font-bold text-brand">
                2
              </span>
              Payment Method
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
                    <p className="mt-1.5 pl-6 text-xs text-muted leading-relaxed">{desc}</p>
                  </div>
                </label>
              ))}
            </div>

            {/* Payment sub-forms */}
            <div className="mt-5">
              {method === "stripe" && (
                <div className="grid gap-3.5 rounded-2xl border border-line bg-page/40 p-5">
                  <div className="flex items-center justify-between border-b border-line/60 pb-3">
                    <span className="text-xs font-semibold text-navy">Stripe Secure Card Processing</span>
                    <span className="flex items-center gap-1 text-[11px] font-medium text-brand">
                      <Lock size={12} /> 256-Bit SSL Encryption
                    </span>
                  </div>

                  <div className="rounded-xl border border-line bg-white p-3.5 shadow-2xs">
                    <CardElement
                      options={{
                        style: {
                          base: {
                            fontSize: "14px",
                            color: "#0f172a",
                            fontFamily: "inherit",
                            "::placeholder": {
                              color: "#94a3b8",
                            },
                          },
                          invalid: {
                            color: "#ef4444",
                          },
                        },
                      }}
                    />
                  </div>

                  <p className="flex items-center gap-1.5 text-xs text-muted">
                    <ShieldCheck size={14} className="text-green-600" /> Card details are verified and tokenized directly with Stripe. No card numbers touch our database.
                  </p>
                </div>
              )}

              {method === "wire" && (
                <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5 text-blue-900">
                  <div className="flex items-center gap-2 font-semibold text-sm">
                    <Landmark size={18} className="text-[#0066ff]" /> Bank Wire & ACH Transfer (B2B Accounts)
                  </div>
                  <p className="mt-2 text-xs text-blue-800 leading-relaxed">
                    Complete your purchase via direct corporate bank wire or ACH debit. Upon placing the order, an official pro-forma invoice with complete bank wiring coordinates will be generated and emailed to your accounting department.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Order Summary Aside */}
        <aside className="h-fit space-y-4 rounded-3xl border border-line bg-white p-6 shadow-card">
          <h2 className="font-display text-lg font-semibold text-navy">Order Summary</h2>
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

          {/* Promo code */}
          <div className="rounded-2xl border border-dashed border-line bg-page/40 p-4">
            <label className="flex items-center gap-1.5 text-sm font-medium text-navy">
              <Tag size={14} className="text-brand" /> Promo Code
            </label>
            <div className="mt-2 flex gap-2">
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                placeholder="e.g. ENTERPRISE10"
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
              <span>{shipping === 0 ? "Free Ground Shipping" : formatMoney(shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Estimated Tax</span>
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
              "Processing Order..."
            ) : (
              <>
                {method === "wire" ? "Place B2B Wire Order" : "Pay Now"} · {formatMoney(Math.max(0, total - discount))}
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </>
            )}
          </button>
          <p className="flex items-center justify-center gap-1.5 text-xs text-muted">
            <Lock size={12} /> 256-Bit SSL Encrypted Enterprise Checkout
          </p>
          <Link href="/cart" className="block text-center text-xs text-muted underline hover:text-brand">
            Back to shopping cart
          </Link>
        </aside>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
