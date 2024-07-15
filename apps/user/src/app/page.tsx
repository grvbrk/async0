import TextImage from "./_components/TextImage";
// import ImageContainer from "./_components/ImageContainer";

export default function Home() {
  return (
    <>
      <div className="grid md:grid-cols-2 min-h-screen overflow-y-hidden">
        <div className="mx-auto px-5 md:my-auto md:mx-auto ">
          <h1 className="scroll-m-20 text-5xl font-extrabold lg:text-5xl lg:leading-[2rem]">
            Solve problems
          </h1>
          <h1 className="scroll-m-20 text-5xl font-extrabold lg:text-5xl">
            in Javascript.
          </h1>
          <TextImage />
        </div>
        <div
          className="overflow-y-hidden p-5 hidden md:block"
          style={{ height: "calc(100vh - 64px)" }}
        >
          {/* <ImageContainer /> */}
        </div>
      </div>
    </>
  );
}
