import { SiteFrame } from "@/components/site-frame";

export default async function RoadmapPreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const title = slug
    .split("-")
    .map((word) => {
      if (word.toUpperCase() === "AI") return "AI";
      if (word.toUpperCase() === "UX") return "UX";
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");

  return (
    <SiteFrame title={`${title} Roadmap`}>
      <div className="w-full h-full flex flex-col items-center gap-4 py-2">
        <div className="w-[calc(100%-2rem)] flex justify-between items-center bg-black/40 backdrop-blur-md border border-white/10 p-4">
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">{title} Industry Roadmap</h2>
          <a 
            href={`/roadmaps/${slug}.pdf`} 
            download 
            className="cta text-xs py-2 px-6"
          >
            Download PDF
          </a>
        </div>
        
        <div className="w-full h-[calc(100vh-180px)] glass-panel overflow-hidden relative">
          <iframe 
            src={`/roadmaps/${slug}.pdf#toolbar=0&navpanes=0&view=FitH`} 
            className="w-full h-full border-none"
            title={`${title} Preview`}
          />
        </div>
      </div>
    </SiteFrame>
  );
}
