import { SiteFrame } from "@/components/site-frame";

export default function CertificatePage() {
  return (
    <SiteFrame title="Completion Certificate">
      <section className="card h-[calc(100dvh-130px)] p-8 grid grid-rows-[auto_1fr_auto] gap-4 overflow-hidden">
        <h2 className="text-4xl font-semibold">Professional Certificate on Completion</h2>
        <article className="card p-8 flex items-center justify-center text-center">
          <div>
            <p className="text-sm tracking-[0.18em] uppercase text-neutral-500">Awarded to successful participants</p>
            <h3 className="text-5xl font-semibold mt-3">Lead with AI Certificate</h3>
            <p className="mt-4 text-lg">Use your credential across resume, LinkedIn, and portfolio evidence.</p>
          </div>
        </article>
        <p className="text-sm text-neutral-500">A completion proof designed for career signaling and trust.</p>
      </section>
    </SiteFrame>
  );
}
