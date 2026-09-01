"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999";
  const message = "Hi! I'm interested in Devi Pickles. Could you please share more details?";

  return (
    <a
      href={`https://wa.me/${phone}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green hover:bg-green-light text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl"
      aria-label="Contact on WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </a>
  );
}
