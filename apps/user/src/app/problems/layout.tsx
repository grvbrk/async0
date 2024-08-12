import { Suspense } from "react";
import BreadCrumbs from "./_components/BreadCrumbs";
import "ldrs/leapfrog";
import CustomLoader from "./_components/CustomLoader";
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
        <Suspense
          fallback={
            <div className="absolute flex h-full w-full justify-center items-center ">
              <CustomLoader />
            </div>
          }
        >
          {children}
        </Suspense>
      </div>
    </>
  );
}
