import StorefrontLayout from "@/components/layout/StorefrontLayout";
import AccountClient from "./AccountClient";

export const metadata = {
  title: "My Account",
  description: "Manage your Devi Pickles account, orders and wishlist.",
};

export default function AccountPage() {
  return (
    <StorefrontLayout>
      <AccountClient />
    </StorefrontLayout>
  );
}
