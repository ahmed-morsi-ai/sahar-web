import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { MotionProvider } from "@/components/providers/motion-provider";
import { StoreProviders } from "@/app/(store)/store-providers";

export default function StoreLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <MotionProvider>
      <StoreProviders>
        <AnalyticsTracker>
          <Navbar />
          <main className="overflow-x-hidden">{children}</main>
          <Footer />
        </AnalyticsTracker>
      </StoreProviders>
    </MotionProvider>
  );
}
