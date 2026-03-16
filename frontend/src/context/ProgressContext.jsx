import { createContext, useContext, useState, useCallback } from "react";

const ProgressContext = createContext();

export function ProgressProvider({ children }) {
  const [active, setActive] = useState(false);

  const start = useCallback(() => setActive(true), []);
  const done  = useCallback(() => setActive(false), []);

  return (
    <ProgressContext.Provider value={{ active, start, done }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  return useContext(ProgressContext);
}