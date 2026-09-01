export function calculateDeliveryCharge(totalWeightInGrams: number, ratePerKg: number = 100, minimumCharge: number = 100, freeDeliveryEnabled: boolean = false, freeDeliveryThreshold: number = 0): number {
  if (freeDeliveryEnabled && freeDeliveryThreshold > 0) {
    const subtotal = totalWeightInGrams * (ratePerKg / 1000);
    if (subtotal >= freeDeliveryThreshold) return 0;
  }

  const weightInKg = Math.ceil(totalWeightInGrams / 1000);
  const charge = weightInKg * ratePerKg;
  return Math.max(charge, minimumCharge);
}

export function formatPrice(price: number): string {
  return `₹${price.toLocaleString("en-IN")}`;
}

export function generateOrderNumber(): string {
  const now = new Date();
  const dateStr = now.getFullYear().toString().slice(-2) +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `DP${dateStr}${random}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getWhatsAppUrl(phone: string, message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
}
