import { useEffect, useState } from "react";
import { checkheading } from "../helper";

// ✅ Correct way to receive props
export const Answers = ({ ans, type }) => {
  const [heading, setHeading] = useState(false);

  useEffect(() => {
    if (checkheading(ans)) {
      setHeading(true);
    }
  }, [ans]);

  // ✅ Question h1 tag me
  if (type === "q") {
    return <h1 className="text-2xl font-bold text-blue-400 my-2">{ans}</h1>;
  }

  // ✅ Answer normal
  return (
    <>
      {heading ? (
        <span className="py-2 text-lg block">
          {ans} <span>:</span>
        </span>
      ) : (
        <p className="text-base">{ans}</p>
      )}
    </>
  );
};
//  piyush 