import { PiCurrencyDollarSimpleDuotone } from "react-icons/pi";

function Status({ points }: { points: number }) {
  return (
    <div className="fixed bottom-2 left-0 h-6 w-full">
      <div className="absolute right-1 flex items-center pr-2 text-lg text-yellow-700">
        <PiCurrencyDollarSimpleDuotone />
        <p>{points === undefined || null ? 0 : points}</p>
      </div>
    </div>
  );
}

export default Status;
