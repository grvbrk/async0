import { useEffect, useState } from "react";

export function useDebounce(text: string, n: number) {
  const [state, setState] = useState<string>(text);
  useEffect(() => {
    const id = setTimeout(() => {
      setState(text);
    }, n * 1000);

    return () => clearTimeout(id);
  }, [text, n]);
  return state;
}
