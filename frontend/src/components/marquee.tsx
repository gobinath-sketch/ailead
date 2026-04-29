"use client";

import React from "react";
import Image from "next/image";

const allLogos = [
  { name: "Amazon", logoKey: "amazon" },
  { name: "Uber", logoKey: "uber" },
  { name: "Swiggy", logoKey: "swiggy" },
  { name: "Google", logoKey: "google" },
  { name: "Microsoft", logoKey: "microsoft" },
  { name: "Adobe", logoKey: "adobe" },
  { name: "Infosys", logoKey: "infosys" },
  { name: "CRED", logoKey: "cred" },
  { name: "IBM", logoKey: "ibm" },
  { name: "Red Hat", logoKey: "redhat" },
  { name: "Tableau", logoKey: "tableau" },
  { name: "Mulesoft", logoKey: "mulesoft" },
  { name: "Blockchain", logoKey: "blockchain" },
  { name: "TD Synnex", logoKey: "tdsynnex" },
  { name: "AI Alliance", logoKey: "aialliance" },
];

export function Marquee() {
  return (
    <div className="w-full overflow-hidden marquee-gradient-mask py-4 mt-6 border-t border-white/5 bg-black/20 backdrop-blur-sm">
      <div className="flex w-max animate-marquee space-x-20 items-center px-12">
        {/* Double array for seamless infinite scroll */}
        {[...allLogos, ...allLogos, ...allLogos].map((logo, idx) => (
          <div 
            key={idx} 
            className="group flex-shrink-0 transition-all duration-500 hover:scale-110 cursor-default flex items-center justify-center"
          >
            <div className="relative h-10 flex items-center justify-center gap-4">
              <Image
                src={`/logos/${logo.logoKey}.png`}
                alt={logo.name}
                width={60}
                height={60}
                unoptimized
                className="h-full w-auto object-contain rounded-none transition-all duration-500 shadow-sm"
              />
              <span className="text-neutral-200 font-bold text-xl tracking-widest uppercase group-hover:text-white transition-colors duration-500">
                 {logo.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
