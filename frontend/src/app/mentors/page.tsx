import { SiteFrame } from "@/components/site-frame";

const mentors = [
  ["Sendhil Kumar S", "Founder and Chairman", "AI learning strategy, adoption roadmaps, and practical transformation leadership."],
  ["Peter Darius", "AI Technology Leader", "Hands-on delivery across AI systems, cloud engineering, and enterprise training."],
  ["Dr. Radhika S", "VP Technical", "Academic depth in neural networks, computer vision, and learner-centered execution."],
  ["Dinesh T", "Chief Technology Officer", "Story-led communication, product strategy, and applied AI capability building."],
];

export default function MentorsPage() {
  return (
    <SiteFrame title="Your Instructors">
      <section className="card h-[calc(100dvh-130px)] p-8 overflow-hidden">
        <h2 className="text-4xl font-semibold mb-4">Learn from practitioners who turn concepts into outcomes</h2>
        <div className="grid grid-cols-2 gap-4">
          {mentors.map((mentor) => (
            <article key={mentor[0]} className="card p-4">
              <h3 className="text-2xl font-semibold">{mentor[0]}</h3>
              <p className="text-sm text-neutral-500">{mentor[1]}</p>
              <p className="mt-3 text-sm">{mentor[2]}</p>
            </article>
          ))}
        </div>
      </section>
    </SiteFrame>
  );
}
