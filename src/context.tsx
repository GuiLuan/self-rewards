import { createContext } from "react";
import { emptyData, StorageData } from "./struct";

interface UpdateData {
  data: StorageData;
  updateData: (data: StorageData) => void;
}

const UpdateDataContext = createContext<UpdateData>({
  data: emptyData,
  updateData: () => {},
});

export { UpdateDataContext };
