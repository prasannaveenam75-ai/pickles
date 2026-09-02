import StorefrontLayout from "@/components/layout/StorefrontLayout";
import WishlistClient from "./WishlistClient";

export const metadata = {
  title: "My Wishlist",
  description: "View your saved products.",
};

export default function WishlistPage() {
  return (
    <StorefrontLayout>
      <WishlistClient />
    </StorefrontLayout>
  );
}
