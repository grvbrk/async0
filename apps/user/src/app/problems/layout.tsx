import BreadCrumbs from "./_components/BreadCrumbs";

export default async function ProblemsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div>
        <BreadCrumbs />
        {children}
      </div>
    </>
  );
}
