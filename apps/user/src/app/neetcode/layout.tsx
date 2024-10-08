import { Suspense } from "react";
import BreadCrumbs from "../problems/_components/BreadCrumbs";
import CustomLoader from "../problems/_components/CustomLoader";

export default async function NeetcodeProblemsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col flex-grow relative">
      <BreadCrumbs />
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
  );
}
