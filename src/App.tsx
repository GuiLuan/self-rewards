import { useState } from "react";

import { Navigation, ShowPage, Status, PageType } from "./components";
import { UpdateDataContext } from "./context";
import { useAsyncEffect, useUpdateEffect } from "ahooks";
import { readData, writeData } from "./utils/data";
import { emptyData, StorageData } from "./struct";

function App() {
  /* 由 Navigation 控制页面切换，并被 ShowPage 感知 */
  const [showPagePos, setShowPagePos] = useState<PageType>("today");
  /* 数据驱动控制页面渲染，将数据的操纵方法放到各个组件中 */
  const [storageData, setStorageData] = useState<StorageData>(emptyData);

  // 仅在第一次组件挂载时读取数据，完成同步
  useAsyncEffect(async () => {
    const data = await readData();
    setStorageData(data);
  }, []);

  // 在第一次挂载之后，每当 StorageData 发生变化，保存数据到本地
  useUpdateEffect(() => {
    writeData(storageData);
  }, [storageData]);

  return (
    <div className="relative flex h-full w-full flex-col">
      <div className="flex flex-1 flex-row">
        <Navigation switchFunc={setShowPagePos} />
        <UpdateDataContext.Provider
          value={{
            data: storageData,
            updateData: setStorageData,
          }}
        >
          <ShowPage data={storageData} showPagePos={showPagePos} />
        </UpdateDataContext.Provider>
      </div>
      <Status points={storageData.points} />
    </div>
  );
}

export default App;
