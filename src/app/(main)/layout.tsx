import { Footer } from "@/components/layout/Footer";

/**
 * Layout for all non-home pages.
 * Wraps children in a scrollable flex container + shows the footer.
 */
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  );
}

