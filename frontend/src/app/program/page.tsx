import { SiteFrame } from "@/components/site-frame";

export default function ProgramPage() {
  return (
    <SiteFrame title="Program Value">
      <section className="card h-[calc(100dvh-130px)] p-8 grid gap-4 overflow-hidden">
        <h2 className="text-4xl font-semibold">AI Fluency for Real Work</h2>
        <p className="text-neutral-500 max-w-4xl">
          This event helps participants move from curiosity to capability. Instead of only learning tools, attendees practice
          asking better questions, validating responses, and building useful outputs across writing, research, automation,
          product prototyping, and content creation.
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div className="card p-4">Rapidly growing AI and data literacy skills for modern careers.</div>
          <div className="card p-4">Human + AI collaboration as a practical operating model.</div>
          <div className="card p-4">Responsible usage as a long-term competitive advantage.</div>
        </div>
        <div className="grid grid-cols-5 gap-3 text-sm">
          {["Clarity", "Prompting", "Verification", "Workflow", "Impact"].map((item) => (
            <div key={item} className="card p-3 text-center font-semibold">{item}</div>
          ))}
        </div>
      </section>
    </SiteFrame>
  );
}
