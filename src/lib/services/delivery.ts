import { connectToDatabase } from "@/lib/mongodb";
import { SiteSettings } from "@/lib/models";

export async function getDeliverySettings() {
  await connectToDatabase();
  const settings = await SiteSettings.findOne().lean();
  return {
    ratePerKg: settings?.deliveryRatePerKg ?? 100,
    minimumCharge: settings?.minimumDeliveryCharge ?? 100,
    freeDeliveryEnabled: settings?.freeDeliveryEnabled ?? false,
    freeDeliveryThreshold: settings?.freeDeliveryThreshold ?? 0,
  };
}

export async function calculateServerDelivery(totalWeightInGrams: number) {
  const settings = await getDeliverySettings();
  const weightInKg = Math.ceil(totalWeightInGrams / 1000);
  let charge = weightInKg * settings.ratePerKg;
  charge = Math.max(charge, settings.minimumCharge);

  if (settings.freeDeliveryEnabled && settings.freeDeliveryThreshold > 0) {
    if (charge >= settings.freeDeliveryThreshold) {
      charge = 0;
    }
  }

  return charge;
}
