"use client";

import { useEffect, useState } from "react";

export default function AnnouncementBar() {
  const [text, setText] = useState("Worldwide Shipping Available • Free Shipping Above ₹999 • Order Now");
  const [active, setActive] = useState(true);

  useEffect(() => {
    fetch("/api/admin/homepage")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data?.announcementBar) {
          setText(d.data.announcementBar.text || text);
          setActive(d.data.announcementBar.active);
        }
      })
      .catch(() => {});
  }, [text]);

  if (!active) return null;

  return (
    <div className="bg-maroon-dark text-white overflow-hidden h-8 flex items-center">
      <div className="animate-marquee whitespace-nowrap flex">
        {[...Array(4)].map((_, i) => (
          <span key={i} className="inline-flex items-center text-[11px] md:text-xs tracking-[0.12em] uppercase font-medium px-8">
            {text}
            <span className="mx-6 text-golden">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
