import { Menu } from "antd";
import { MdOutlineWbSunny } from "react-icons/md";
import { MdCurrencyExchange } from "react-icons/md";
import { MdOutlineTaskAlt } from "react-icons/md";
import { RiChatHistoryLine } from "react-icons/ri";

const PageInfo = [
  {
    key: "today",
    label: "今日",
    icon: <MdOutlineWbSunny />,
  },
  {
    key: "quest",
    label: "悬赏",
    icon: <MdOutlineTaskAlt />,
  },
  {
    key: "reward",
    label: "兑换",
    icon: <MdCurrencyExchange />,
  },
  {
    key: "history",
    label: "历史",
    icon: <RiChatHistoryLine />,
  },
];

type PageType = "today" | "quest" | "reward" | "history";

function Navigation({ switchFunc }: { switchFunc: (key: PageType) => void }) {
  return (
    <div className="fixed left-0 top-0 z-50 mt-3 h-full w-24 flex-shrink-0">
      <Menu
        items={PageInfo}
        defaultSelectedKeys={["today"]}
        className="border-none"
        style={{
          borderInlineEnd: "none",
        }}
        onClick={({ key }) => switchFunc(key as PageType)}
      />
    </div>
  );
}

export type { PageType };
export { PageInfo, Navigation };
