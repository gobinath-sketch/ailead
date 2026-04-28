import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

const links = [
  ["/", "Home"],
  ["/program", "Program"],
  ["/schedule", "Schedule"],
  ["/mentors", "Mentors"],
  ["/modules", "Modules"],
  ["/certificate", "Certificate"],
  ["/register", "Register"],
];

export function SiteFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="shell">
      <header className="card m-4 p-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-semibold">{title}</h1>
          <div className="flex items-center gap-2">
            {links.map(([href, label]) => (
              <Link key={href} href={href} className="card px-3 py-2 text-sm">
                {label}
              </Link>
            ))}
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="px-4 pb-4">{children}</main>
    </div>
  );
}
