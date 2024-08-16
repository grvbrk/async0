import BreadCrumbs from "./_components/BreadCrumbs";
import "ldrs/leapfrog";
export default async function ProblemsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex flex-col flex-grow relative">
        <div className="flex items-center">
          <BreadCrumbs />
        </div>

        {children}
      </div>
    </>
  );
}
