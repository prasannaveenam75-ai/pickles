import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1 pb-20 lg:pb-0">{children}</main>
      <Footer />
      <WhatsAppButton />
      <MobileBottomNav />
    </>
  );
}
