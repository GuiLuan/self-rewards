import { PiCurrencyDollarSimpleDuotone } from "react-icons/pi";
import { TiArrowUpOutline, TiArrowDownOutline } from "react-icons/ti";
import {
  PiClockCounterClockwiseBold,
  PiClockClockwiseBold,
} from "react-icons/pi";
import { StorageData } from "../struct";
import { isToday } from "../utils/common";

function Status({ data }: { data: StorageData }) {
  const instances = data.instances.filter((instance) =>
    isToday(instance.createTime),
  );
  return (
    <div className="fixed bottom-2 left-0 h-6 w-full">
      <div className="absolute right-0 flex flex-row gap-1">
        <div className="flex items-center pr-2 text-lg text-orange-700">
          <PiClockCounterClockwiseBold />
          <p>
            {data.instances
              .filter((instance) => instance.type === "quest")
              .reduce((total, instance) => total + instance.points, 0)}
          </p>
        </div>
        <div className="flex items-center pr-2 text-lg text-orange-700">
          <TiArrowDownOutline />
          <p>
            {instances
              .filter((instance) => instance.type === "quest")
              .reduce((total, instance) => total + instance.points, 0)}
          </p>
        </div>
        <div className="flex items-center pr-2 text-lg text-green-600">
          <PiClockClockwiseBold />
          <p>
            {data.instances
              .filter((instance) => instance.type === "reward")
              .reduce((total, instance) => total + instance.templatePoints, 0)}
          </p>
        </div>
        <div className="flex items-center pr-2 text-lg text-green-600">
          <TiArrowUpOutline />
          <p>
            {instances
              .filter((instance) => instance.type === "reward")
              .reduce((total, instance) => total + instance.templatePoints, 0)}
          </p>
        </div>
        <div className="flex items-center pr-2 text-lg text-yellow-700">
          <PiCurrencyDollarSimpleDuotone />
          <p>{data.points === undefined || null ? 0 : data.points}</p>
        </div>
      </div>
    </div>
  );
}

export default Status;
