import { createContext } from "react";

const PointsContext = createContext({
  points: 0,
  setPoints: (points: number) => {},
});

const UpdatePageContext = createContext({
  updatePage: () => {},
});

export { PointsContext, UpdatePageContext };
