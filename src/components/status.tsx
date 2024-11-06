import { PiCurrencyDollarSimpleDuotone } from "react-icons/pi";

function Status({ points }: { points: number }) {
  return (
    <div className="fixed bottom-0 left-0 h-6 w-full">
      <div className="absolute right-0 flex items-center pr-2 text-sm text-gray-400">
        <PiCurrencyDollarSimpleDuotone />
        <p>{points === undefined || null ? 0 : points}</p>
      </div>
    </div>
  );
}

export default Status;
