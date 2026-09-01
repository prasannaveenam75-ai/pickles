import { connectToDatabase } from "@/lib/mongodb";
import { SiteSettings } from "@/lib/models";

export async function getSiteSettings() {
  await connectToDatabase();
  let settings = await SiteSettings.findOne().lean();
  if (!settings) {
    settings = await SiteSettings.create({
      businessName: "Devi Pickles",
      businessAddress: "",
      phone: "",
      whatsappNumber: process.env.WHATSAPP_NUMBER || "",
      email: "",
      fssaiNumber: "20126122000228",
    });
  }
  return settings;
}

export async function updateSiteSettings(data: Record<string, unknown>) {
  await connectToDatabase();
  const settings = await SiteSettings.findOneAndUpdate({}, { $set: data }, { new: true, upsert: true });
  return settings;
}
