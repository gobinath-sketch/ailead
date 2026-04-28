import { SiteFrame } from "@/components/site-frame";

const rows = [
  ["Day 1 | 10 AM - 1 PM", "Getting Started with Generative AI", "Foundations, models, risks, future landscape."],
  ["Day 1 | 2 PM - 5 PM", "Building Personalized AI Agents", "Writing assistant design, prompts, structured workflows."],
  ["Day 2 | 10 AM - 1 PM", "Building Products Using AI", "Vibe coding, product concepts, rapid prototyping."],
  ["Day 2 | 2 PM - 5 PM", "Visual Storytelling with AI", "Image prompts, short-form conversion, campaign assets."],
];

export default function SchedulePage() {
  return (
    <SiteFrame title="2-Day Schedule">
      <section className="card h-[calc(100dvh-130px)] p-8 overflow-hidden">
        <h2 className="text-4xl font-semibold mb-4">Event Timeline</h2>
        <div className="grid gap-3">
          {rows.map((row) => (
            <article key={row[0]} className="card p-4 grid grid-cols-[220px_320px_1fr] gap-4 items-center">
              <p className="text-sm text-neutral-500">{row[0]}</p>
              <h3 className="text-xl font-semibold">{row[1]}</h3>
              <p className="text-sm text-neutral-500">{row[2]}</p>
            </article>
          ))}
        </div>
        <p className="mt-4 card p-4 text-sm">5 PM to 6 PM on Day 2: Graduation showcase, reflection, and certification guidance.</p>
      </section>
    </SiteFrame>
  );
}
