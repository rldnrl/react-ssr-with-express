import { createContext, useContext } from "react";

type PreloadContextType = {
  done: boolean;
  promises: any[];
} | null;

const PreloadContext = createContext<PreloadContextType>(null);
export default PreloadContext;

export const Preloader = ({ resolve }: { resolve: any }) => {
  const preloadContext = useContext(PreloadContext);
  if (!preloadContext) return null;
  if (preloadContext.done) return null;

  preloadContext.promises.push(Promise.resolve(resolve()));
  return null;
};
