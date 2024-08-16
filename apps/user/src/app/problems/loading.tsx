import React from "react";
import CustomLoader from "./_components/CustomLoader";

export default function LoadingPage() {
  return (
    <div className="absolute flex h-full w-full justify-center items-center ">
      <CustomLoader />
    </div>
  );
}
