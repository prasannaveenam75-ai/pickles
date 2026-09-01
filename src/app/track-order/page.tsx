import StorefrontLayout from "@/components/layout/StorefrontLayout";
import TrackOrderClient from "./TrackOrderClient";

export const metadata = {
  title: "Track Your Order",
  description: "Track the status of your Devi Pickles order.",
};

export default function TrackOrderPage() {
  return (
    <StorefrontLayout>
      <TrackOrderClient />
    </StorefrontLayout>
  );
}
