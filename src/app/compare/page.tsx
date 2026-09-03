import StorefrontLayout from "@/components/layout/StorefrontLayout";
import CompareClient from "./CompareClient";

export const metadata = {
  title: "Compare Products",
  description: "Compare Devi Pickles products side by side.",
};

export default function ComparePage() {
  return (
    <StorefrontLayout>
      <CompareClient />
    </StorefrontLayout>
  );
}
