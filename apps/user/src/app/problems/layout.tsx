import BreadCrumbs from "./_components/BreadCrumbs";
import Sidebar from "./_components/Sidebar";

export default async function ProblemsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* <Sidebar /> */}
      <BreadCrumbs />
      {children}
    </>
  );
}
