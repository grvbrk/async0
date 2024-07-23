import BreadCrumbs from "../problems/_components/BreadCrumbs";

export default async function NeetcodeProblemsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-screen">
      <BreadCrumbs />
      {children}
    </div>
  );
}
