import { FloatButton, notification } from "antd";
import { GrAdd } from "react-icons/gr";

import { TemplateCard, HistoryInstanceCard, TodayInstanceCard } from "./card";
import { PageType } from "./navigation";
import { useContext, useState } from "react";
import { StorageData } from "../struct/data";
import { TemplateOp } from "../utils/data";
import { isToday } from "../utils/common";
import { UpdateDataContext } from "../context";
import { FormModal } from "./modal";

function TodayPage({ data }: { data: StorageData }) {
  // 筛选出今天创建的instance
  const instances = data.instances.filter((instance) =>
    isToday(instance.createTime),
  );

  return (
    <>
      {instances.map((instance) => (
        <TodayInstanceCard key={instance.instanceId} instance={instance} />
      ))}
    </>
  );
}

function QuestPage({ data }: { data: StorageData }) {
  const templates = data.templates.filter(
    (template) => template.type === "quest",
  );

  return (
    <>
      {templates.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </>
  );
}

function RewardPage({ data }: { data: StorageData }) {
  const templates = data.templates.filter(
    (template) => template.type === "reward",
  );

  return (
    <>
      {templates.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </>
  );
}

function HistoryPage({ data }: { data: StorageData }) {
  const instances = data.instances;
  return (
    <>
      {instances.map((instance) => (
        <HistoryInstanceCard key={instance.instanceId} instance={instance} />
      ))}
    </>
  );
}

const selectPage = (page: PageType, data: StorageData) => {
  let showPage;
  switch (page) {
    case "today":
      showPage = <TodayPage data={data} />;
      break;
    case "quest":
      showPage = <QuestPage data={data} />;
      break;
    case "reward":
      showPage = <RewardPage data={data} />;
      break;
    case "history":
      showPage = <HistoryPage data={data} />;
      break;
  }
  return (
    <div className="relative ml-24 flex flex-1 flex-row flex-wrap place-content-start pb-3">
      {showPage}
    </div>
  );
};

function ShowPage({
  data,
  showPagePos,
}: {
  data: StorageData;
  showPagePos: PageType;
}) {
  /* 控制 Form 表单弹出与否 */
  const [open, setOpen] = useState(false);
  /* 操纵数据，修改数据后会触发顶层保存数据 */
  const { updateData } = useContext(UpdateDataContext);

  return (
    <>
      {selectPage(showPagePos, data)}
      <FloatButton.Group shape="circle">
        <FloatButton
          icon={<GrAdd />}
          type="primary"
          tooltip="新增模板"
          onClick={() => setOpen(true)}
        />
      </FloatButton.Group>

      <FormModal
        modalTitle="新增模板"
        open={open}
        setOpen={setOpen}
        onSubmit={(form) => {
          updateData({
            ...data,
            templates: TemplateOp.add(data.templates, form),
          });
          setOpen(false);
          notification.success({
            message: `${form.type === "quest" ? "🏆" : "✨"} 添加${form.type === "quest" ? "成就" : "奖励"}`,
            description: `${form.name} 已添加`,
          });
        }}
      />
    </>
  );
}

export default ShowPage;
