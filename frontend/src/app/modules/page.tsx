import { SiteFrame } from "@/components/site-frame";

const modules = [
  ["Module 1", "Generative AI Foundations", "Concepts, terminology, risk awareness, and safe adoption habits."],
  ["Module 2", "Personalized Agent Design", "Role, context, memory, tools, and iterative quality improvement."],
  ["Module 3", "AI Product Prototyping", "Feature mapping, low-code workflows, testing, and feedback loops."],
  ["Module 4", "Visual Content Systems", "Prompt-to-image direction, storyboard design, and quality controls."],
];

export default function ModulesPage() {
  return (
    <SiteFrame title="Module Overviews">
      <section className="card h-[calc(100dvh-130px)] p-8 overflow-hidden">
        <h2 className="text-4xl font-semibold mb-4">From awareness to action</h2>
        <div className="grid grid-cols-2 gap-4">
          {modules.map((module) => (
            <article key={module[0]} className="card p-4">
              <p className="text-sm text-neutral-500">{module[0]}</p>
              <h3 className="text-2xl font-semibold mt-1">{module[1]}</h3>
              <p className="mt-2 text-sm">{module[2]}</p>
            </article>
          ))}
        </div>
      </section>
    </SiteFrame>
  );
}
