import { Suspense } from "react";
import CustomLoader from "../_components/CustomLoader";

export default async function ProblemIDLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col flex-grow relative">
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
