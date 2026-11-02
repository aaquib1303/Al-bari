/**
 * Home route group layout.
 * - No footer
 * - Viewport-locked: the home page never scrolls
 */
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /* h-[calc(100dvh-64px)] = full viewport minus navbar (h-16 = 64px) */
    <div className="flex-1 overflow-hidden bg-white flex flex-col">
      {children}
    </div>
  );
}
