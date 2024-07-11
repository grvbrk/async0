"use client";

import { ReactNode, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import useMeasure from "react-use-measure";

let duration = 0.5;

// export function Example() {
//   let [foo, setFoo] = useState(false);
//   let [count, setCount] = useState(0);

//   return (
//     <MotionConfig transition={{ duration, type: "tween" }}>
//       <div className="flex min-h-screen flex-col p-10 text-black">
//         <div className="mx-auto mt-8 h-full w-full max-w-sm border border-black pt-8">
//           <h1 className="mb-8 text-center text-3xl font-thin">Hello</h1>
//           <div className="mb-8 flex justify-between px-8">
//             <button
//               className="border border-black px-2 py-1"
//               onClick={() => setCount(count + 1)}
//             >
//               Toggle
//             </button>
//             <button
//               className="border border-black px-2 py-1"
//               onClick={() => setFoo(!foo)}
//             >
//               Rerender ({foo ? "y" : "n"})
//             </button>
//           </div>
//           <AnimatePanel>
//             {count % 3 === 2 ? (
//               <Card className="w-80">
//                 <CardHeader>
//                   <CardTitle className="flex items-center mb-2 ">
//                     <div className="text-2xl font-extrabold">Grvbrk</div>
//                     <Badge className="text-white ml-auto">hard</Badge>
//                   </CardTitle>
//                   <CardDescription></CardDescription>
//                 </CardHeader>
//                 <CardContent></CardContent>
//               </Card>
//             ) : count % 3 === 1 ? (
//               <p>
//                 Something a bit longer. Lorem ipsum dolor sit amet consectetur
//                 adipisicing elit. Repudiandae modi vel odio.
//               </p>
//             ) : (
//               <p>Something short.</p>
//             )}
//           </AnimatePanel>
//         </div>
//       </div>
//     </MotionConfig>
//   );
// }

export default function AnimatePanel({
  children,
  direction,
}: {
  children: ReactNode;
  direction: "left" | "right";
}) {
  let [ref, { height }] = useMeasure();

  return (
    <motion.div
      animate={{ height: height || "auto" }}
      className="relative overflow-hidden"
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={JSON.stringify(children, ignoreCircularReferences())}
          custom={direction}
          variants={{
            enter: (direction: string) => ({
              x: direction === "right" ? -400 : 400,
              opacity: 0,
            }),
            center: {
              x: 0,
              opacity: 1,
            },
            exit: (direction: string) => ({
              x: direction === "right" ? 400 : -400,
              opacity: 0,
            }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: {
              type: "tween",
              duration: 0.3,
              ease: "easeInOut",
            },
            opacity: { duration: 0.2 },
          }}
          className={height ? "absolute w-full" : "relative w-full"}
        >
          <div ref={ref}>{children}</div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

/*
  Replacer function to JSON.stringify that ignores
  circular references and internal React properties.

  https://github.com/facebook/react/issues/8669#issuecomment-531515508
*/
const ignoreCircularReferences = () => {
  const seen = new WeakSet();
  return (key: any, value: any) => {
    if (key.startsWith("_")) return; // Don't compare React's internal props.
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) return;
      seen.add(value);
    }
    return value;
  };
};
