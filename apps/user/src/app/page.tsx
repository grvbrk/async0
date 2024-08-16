"use client";
import TextImage from "./_components/TextImage";
import HeroImage from "./_components/HeroImage";

export default function Home() {
  return (
    <>
      <div className="flex flex-1 justify-center pt-28 relative lg:pt-0 lg:flex lg:flex-col lg:justify-center">
        <div className="flex flex-col h-full w-fit px-10 lg:ml-52">
          <h1 className="text-4xl leading-7 font-extrabold lg:text-7xl lg:leading-10">
            Solve problems
          </h1>
          <h1 className="text-4xl font-extrabold lg:text-7xl">
            in Javascript.
          </h1>
          <div className="w-[250px] lg:w-[500px]">
            <TextImage />
          </div>
        </div>
        <div className="absolute bottom-0 right-0 px-5">
          <HeroImage />
        </div>
      </div>
    </>
  );
}
