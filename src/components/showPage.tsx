import { Badge, FloatButton, notification } from "antd";
import { GrAdd } from "react-icons/gr";
import { FaSortAmountDownAlt } from "react-icons/fa";

import { TemplateCard, HistoryInstanceCard, TodayInstanceCard } from "./card";
import { PageType } from "./navigation";
import { useContext, useState } from "react";
import { StorageData } from "../struct/data";
import { TemplateOp } from "../utils/data";
import { isToday } from "../utils/common";
import { UpdateDataContext } from "../context";
import { TemplateModal } from "./modal";
import { BaseTemplate } from "../struct";

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
      {templates.map((template) =>
        Array.isArray(data.topTemplateIds) &&
        data.topTemplateIds.includes(template.id) ? (
          <Badge.Ribbon text="置顶" color="purple" key={template.id}>
            <TemplateCard template={template} />
          </Badge.Ribbon>
        ) : (
          <TemplateCard key={template.id} template={template} />
        ),
      )}
    </>
  );
}

function RewardPage({ data }: { data: StorageData }) {
  const templates = data.templates.filter(
    (template) => template.type === "reward",
  );

  return (
    <>
      {templates.map((template) =>
        Array.isArray(data.topTemplateIds) &&
        data.topTemplateIds.includes(template.id) ? (
          <Badge.Ribbon text="目标" color="volcano" key={template.id}>
            <TemplateCard template={template} />
          </Badge.Ribbon>
        ) : (
          <TemplateCard key={template.id} template={template} />
        ),
      )}
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
          icon={<FaSortAmountDownAlt />}
          tooltip="排序模板"
          onClick={() => {
            updateData({
              ...data,
              templates: TemplateOp.sort(data.templates, data.topTemplateIds),
            });
            notification.success({
              message: "📈 模板已排序",
              description: `${data.templates.length} 个模板已根据点数升序排序，点数相同的再根据已使用次数和次数限额的比值升序排序`,
              showProgress: true,
              duration: 1,
              placement: "bottomRight",
            });
          }}
        />
        <FloatButton
          icon={<GrAdd />}
          type="primary"
          tooltip="新增模板"
          onClick={() => setOpen(true)}
        />
      </FloatButton.Group>

      <TemplateModal
        modalTitle="新增模板"
        open={open}
        setOpen={setOpen}
        onSubmit={(form) => {
          const { templates, id } = TemplateOp.add(data.templates, {
            ...form,
            onTop: undefined,
          } as BaseTemplate);
          let topTemplateIds = data.topTemplateIds;
          if (form.onTop === true) {
            if (Array.isArray(topTemplateIds)) {
              topTemplateIds = [...topTemplateIds, id];
            } else {
              topTemplateIds = [id];
            }
          }
          updateData({
            ...data,
            templates: templates,
            topTemplateIds: topTemplateIds,
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
