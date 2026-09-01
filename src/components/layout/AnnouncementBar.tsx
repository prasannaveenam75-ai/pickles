"use client";

import { useEffect, useState } from "react";

export default function AnnouncementBar() {
  const [text, setText] = useState("AUTHENTIC HOMEMADE PICKLES • FRESHLY PREPARED • MADE WITH LOVE");
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
    <div className="bg-green-dark text-white text-center py-2 px-4 text-[11px] md:text-xs tracking-[0.15em] uppercase font-medium">
      {text}
    </div>
  );
}
