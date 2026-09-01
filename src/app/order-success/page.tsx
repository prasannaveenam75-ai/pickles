import StorefrontLayout from "@/components/layout/StorefrontLayout";
import OrderSuccessClient from "./OrderSuccessClient";

export default async function OrderSuccessPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order } = await searchParams;

  return (
    <StorefrontLayout>
      <OrderSuccessClient orderNumber={order || ""} />
    </StorefrontLayout>
  );
}
