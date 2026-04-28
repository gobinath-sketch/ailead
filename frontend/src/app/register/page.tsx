"use client";

import { SiteFrame } from "@/components/site-frame";
import { FormEvent, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const api = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    role: "",
    goals: "",
  });
  const [paymentId, setPaymentId] = useState("");
  const [paid, setPaid] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const onPay = async () => {
    try {
      setBusy(true);
      setMessage("");
      const orderResponse = await fetch(`${api}/payments/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
        }),
      });
      if (!orderResponse.ok) throw new Error("Could not initialize payment order.");
      const order = await orderResponse.json();

      const razorpay = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: "Lead with AI Program",
        description: order.description,
        prefill: { name: form.fullName, email: form.email, contact: form.phone },
        handler: async (response: Record<string, string>) => {
          const verify = await fetch(`${api}/payments/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              fullName: form.fullName,
              email: form.email,
              phone: form.phone,
            }),
          });
          if (!verify.ok) throw new Error("Payment verification failed.");
          const result = await verify.json();
          setPaid(true);
          setPaymentId(result.paymentId);
          setMessage("Payment confirmed. Registration button is now enabled.");
        },
      });
      razorpay.open();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Payment failed.");
    } finally {
      setBusy(false);
    }
  };

  const onRegister = async (event: FormEvent) => {
    event.preventDefault();
    if (!paid || !paymentId) return;
    setBusy(true);
    setMessage("");
    const response = await fetch(`${api}/registrations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, paymentId }),
    });
    const result = await response.json();
    setBusy(false);
    if (!response.ok) {
      setMessage(result.message ?? "Registration failed.");
      return;
    }
    setMessage(`Registration complete. Your reference ID: ${result.id}`);
  };

  return (
    <SiteFrame title="Secure Registration">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <form onSubmit={onRegister} className="card h-[calc(100dvh-130px)] p-8 grid grid-cols-2 gap-4 overflow-hidden">
        {[
          ["fullName", "Full name"],
          ["email", "Email"],
          ["phone", "Phone (10 digits)"],
          ["organization", "Organization"],
          ["role", "Role"],
        ].map(([key, label]) => (
          <label key={key} className="grid gap-1 text-sm">
            <span>{label}</span>
            <input
              className="card px-3 py-2"
              value={form[key as keyof typeof form]}
              onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
              required={key === "fullName" || key === "email" || key === "phone"}
            />
          </label>
        ))}
        <label className="grid gap-1 text-sm col-span-2">
          <span>Learning goals</span>
          <textarea className="card px-3 py-2 h-24" value={form.goals} onChange={(e) => setForm((prev) => ({ ...prev, goals: e.target.value }))} />
        </label>
        <div className="col-span-2 flex items-center gap-3">
          <button type="button" className="cta" onClick={onPay} disabled={busy}>
            Pay Registration Fee
          </button>
          <button type="submit" className="cta" disabled={!paid || busy}>
            Register (Enabled only after payment)
          </button>
        </div>
        <p className="col-span-2 text-sm">{message}</p>
      </form>
    </SiteFrame>
  );
}
