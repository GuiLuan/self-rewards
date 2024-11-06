import { useRef, useState } from "react";
import { useAsyncEffect } from "ahooks";

import { Navigation } from "./components/navigation";
import { PageType } from "./components/navigation";
import ShowPage from "./components/showPage";
import Status from "./components/status";
import { readData, updatePoints } from "./utils/data";
import { StorageData } from "./struct/data";
import { PointsContext } from "./components/ctx";

function App() {
  // 页面切换
  const [showPagePos, setShowPagePos] = useState<PageType>("today");
  const [points, setPoints] = useState(0);

  const dataRef = useRef<StorageData>({
    templates: [],
    instances: [],
    points: 0,
  });

  useAsyncEffect(async () => {
    if (dataRef.current === undefined) {
      const data = await readData();
      dataRef.current = data;
    }
  }, [points]);

  return (
    <div className="relative flex h-full w-full flex-col">
      <div className="flex flex-1 flex-row">
        <Navigation switchFunc={setShowPagePos} />
        <PointsContext.Provider
          value={{
            points,
            setPoints: (points: number) => {
              setPoints(points);
              updatePoints(points);
            },
          }}
        >
          <ShowPage showPagePos={showPagePos} />
        </PointsContext.Provider>
      </div>
      <Status points={points} />
    </div>
  );
}

export default App;
