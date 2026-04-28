import Link from "next/link";
import { SiteFrame } from "@/components/site-frame";

export default function Home() {
  return (
    <SiteFrame title="Lead with AI: Adopt, Implement, Transform">
      <section className="card h-[calc(100dvh-130px)] p-8 grid grid-rows-[auto_auto_1fr_auto] gap-5 overflow-hidden">
        <p className="text-sm tracking-[0.18em] uppercase text-neutral-500">2-Day Professional AI Program</p>
        <h2 className="text-5xl font-semibold max-w-4xl">Build practical AI confidence and convert ideas into execution.</h2>
        <div className="grid grid-cols-3 gap-4">
          <article className="card p-4">
            <p className="text-xs text-neutral-500">01</p>
            <h3 className="text-2xl font-semibold mt-2">Adopt</h3>
            <p className="mt-2 text-sm text-neutral-500">Understand AI fundamentals, model behavior, and responsible usage patterns.</p>
          </article>
          <article className="card p-4">
            <p className="text-xs text-neutral-500">02</p>
            <h3 className="text-2xl font-semibold mt-2">Implement</h3>
            <p className="mt-2 text-sm text-neutral-500">Design working agents and repeatable workflows for study and professional tasks.</p>
          </article>
          <article className="card p-4">
            <p className="text-xs text-neutral-500">03</p>
            <h3 className="text-2xl font-semibold mt-2">Transform</h3>
            <p className="mt-2 text-sm text-neutral-500">Deliver measurable output that improves career readiness and team productivity.</p>
          </article>
        </div>
        <div className="flex gap-3">
          <Link href="/program" className="cta">Explore Event Details</Link>
          <Link href="/register" className="card px-4 py-2 font-semibold">Proceed to Registration</Link>
        </div>
      </section>
    </SiteFrame>
  );
}
