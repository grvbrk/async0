import Searchbar from "../_components/Searchbar";
import BreadCrumbs from "./_components/BreadCrumbs";

export default async function ProblemsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div>
        <div className="flex items-center">
          <BreadCrumbs />
          <Searchbar className="lg:hidden ml-auto mt-5" />
        </div>
        {children}
      </div>
    </>
  );
}
