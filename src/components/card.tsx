import {
  Card,
  Tooltip,
  Space,
  Button,
  ConfigProvider,
  Dropdown,
  Popconfirm,
  notification,
  Image,
  Drawer,
  Typography,
  Divider,
} from "antd";
import { useContext, useState } from "react";
import { IoMdTimer } from "react-icons/io";
import { BiDetail } from "react-icons/bi";
import { PiCurrencyDollarSimpleDuotone } from "react-icons/pi";
import { FaWineBottle } from "react-icons/fa";
import { IoInfiniteOutline } from "react-icons/io5";
import { RiShoppingCartLine } from "react-icons/ri";
import { GrMore } from "react-icons/gr";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { FaStar, FaRegStar } from "react-icons/fa";

import { BaseInstance, BaseTemplate } from "../struct";
import { InstanceOp, TemplateOp } from "../utils";
import { UpdateDataContext } from "../context";
import { InstanceModal, TemplateModal } from "./modal";
import { QuestInstance, RewardInstance } from "../struct/instance";

function TemplateCard({ template }: { template: BaseTemplate }) {
  const [openAlterModal, setOpenAlterModal] = useState(false);
  const [openCompleteModal, setOpenCompleteModal] = useState(false);

  const { data, updateData } = useContext(UpdateDataContext);

  let textColor;

  if (template.usedCount >= template.repeatCount) {
    textColor = "text-red-500";
  } else if (template.usedCount >= template.repeatCount / 2) {
    textColor = "text-yellow-600";
  }

  return (
    <Card
      title={
        <Tooltip title={template.name} placement="bottomLeft">
          <p>
            {template.name.length >= 9
              ? template.name.slice(0, 9) + "..."
              : template.name}
          </p>
        </Tooltip>
      }
      extra={
        <Space>
          <Tooltip title={template.pointsExplan} placement="bottomLeft">
            <Space
              size={1}
              className={
                template.type === "quest"
                  ? "cursor-help text-orange-600"
                  : "cursor-help text-green-700"
              }
            >
              <PiCurrencyDollarSimpleDuotone />
              <p>{template.points}</p>
            </Space>
          </Tooltip>
          <Dropdown
            trigger={["click"]}
            menu={{
              items: [
                {
                  key: "edit",
                  icon: <FaRegEdit />,
                  label: "编辑",
                  onClick: () => {
                    setOpenAlterModal(true);
                  },
                },

                template.type === "reward" &&
                !data.topTemplateIds?.includes(template.id)
                  ? {
                      key: "track",
                      icon: <FaRegStar />,
                      label: "目标",
                      onClick: () => {
                        updateData({
                          ...data,
                          topTemplateIds: Array.isArray(data.topTemplateIds)
                            ? [...data.topTemplateIds, template.id]
                            : [template.id],
                        });
                        notification.success({
                          message: "设置目标",
                          description: `🎁 ${template.name} 被设为目标`,
                          showProgress: true,
                        });
                      },
                    }
                  : null,
                template.type === "reward" &&
                data.topTemplateIds?.includes(template.id)
                  ? {
                      key: "untrack",
                      icon: <FaStar />,
                      label: "取消目标",
                      onClick: () => {
                        updateData({
                          ...data,
                          topTemplateIds: data.topTemplateIds?.filter(
                            (id) => id !== template.id,
                          ),
                        });
                        notification.warning({
                          message: "取消目标",
                          description: `🎁 ${template.name} 不再是目标`,
                          showProgress: true,
                        });
                      },
                    }
                  : null,
                template.type === "quest" &&
                !data.topTemplateIds?.includes(template.id)
                  ? {
                      key: "topQuest",
                      icon: <FaRegStar />,
                      label: "置顶",
                      onClick: () => {
                        updateData({
                          ...data,
                          topTemplateIds: Array.isArray(data.topTemplateIds)
                            ? [...data.topTemplateIds, template.id]
                            : [template.id],
                        });
                        notification.success({
                          message: "置顶成功",
                          description: `🏆 ${template.name} 被置顶`,
                        });
                      },
                    }
                  : null,
                template.type === "quest" &&
                data.topTemplateIds?.includes(template.id)
                  ? {
                      key: "untopQuest",
                      icon: <FaStar />,
                      label: "取消置顶",
                      onClick: () => {
                        updateData({
                          ...data,
                          topTemplateIds: data.topTemplateIds?.filter(
                            (id) => id !== template.id,
                          ),
                        });
                        notification.warning({
                          message: "取消置顶",
                          description: `🏆 ${template.name} 不再置顶`,
                        });
                      },
                    }
                  : null,
                {
                  key: "delete",
                  icon: <RiDeleteBinLine />,
                  danger: true,
                  label: (
                    <Popconfirm
                      title="确定删除吗？"
                      okText="确定"
                      cancelText="取消"
                      onConfirm={() => {
                        updateData({
                          ...data,
                          templates: TemplateOp.del(
                            data.templates,
                            template.id,
                          ),
                          topTemplateIds: data.topTemplateIds?.includes(
                            template.id,
                          )
                            ? data.topTemplateIds?.filter(
                                (id) => id !== template.id,
                              )
                            : data.topTemplateIds,
                        });
                        notification.warning({
                          message: "删除成功",
                          description: `${template.type === "quest" ? "🏆 成就" : "🎁 奖励"} ${template.name}`,
                          showProgress: true,
                        });
                      }}
                    >
                      <p>删除</p>
                    </Popconfirm>
                  ),
                },
              ],
            }}
            className="hover:cursor-pointer"
          >
            <GrMore className="text-gray-500" />
          </Dropdown>
          <TemplateModal
            modalTitle="修改模板"
            open={openAlterModal}
            setOpen={setOpenAlterModal}
            onSubmit={(form) => {
              let topTemplateIds = data.topTemplateIds;
              if (form.onTop === true) {
                if (Array.isArray(topTemplateIds)) {
                  topTemplateIds = [...topTemplateIds, template.id];
                } else {
                  topTemplateIds = [template.id];
                }
              }
              updateData({
                ...data,
                templates: TemplateOp.update(data.templates, template.id, {
                  ...form,
                  onTop: undefined,
                } as BaseTemplate),
                topTemplateIds: topTemplateIds,
              });
              setOpenAlterModal(false);
              notification.success({
                message: "修改成功",
                description: `🎉 ${template.name} 修改成功`,
              });
            }}
            initialValues={{
              ...template,
              onTop: data.topTemplateIds?.includes(template.id)
                ? true
                : undefined,
            }}
          />
        </Space>
      }
      className={
        template.base64 === undefined
          ? "ml-3 mt-3 h-44 w-64"
          : "ml-3 mt-3 h-[390px] w-64"
      }
    >
      {
        <>
          {template.base64 === undefined ? null : (
            <div className="flex items-center justify-center pb-2">
              <Image height={"200px"} src={template.base64} />
            </div>
          )}
          <div className="flex flex-col gap-1 text-gray-500">
            <Space>
              <BiDetail />
              <Tooltip title={template.desc} placement="bottomLeft">
                <p className="underline underline-offset-1">详情</p>
              </Tooltip>
            </Space>
            <Space className={textColor}>
              <IoInfiniteOutline />
              <p className={textColor}>
                次数 : {template.usedCount} / {template.repeatCount}
              </p>
            </Space>
          </div>
          <ConfigProvider
            theme={{
              components: {
                Button: {
                  colorPrimary:
                    template.type === "quest" ? "#f8861b" : "#22c55e",
                  algorithm: true,
                },
              },
            }}
          >
            <InstanceModal
              open={openCompleteModal}
              setOpen={setOpenCompleteModal}
              maxPoints={template.points}
              onSubmit={(v) => {
                updateData({
                  ...data,
                  templates: TemplateOp.update(data.templates, template.id, {
                    usedCount: template.usedCount + 1,
                  }),
                  instances: InstanceOp.add(
                    data.instances,
                    template,
                    v.points,
                    v.pointsExplan,
                  ) as (QuestInstance | RewardInstance)[],
                  points: data.points + v.points,
                });
                notification.success({
                  message: `🏆 达成：${template.name}`,
                  description: `获得 ${v.points} 点数`,
                  showProgress: true,
                });
                if (
                  data.topTemplateIds !== undefined &&
                  data.topTemplateIds.length !== 0
                ) {
                  data.topTemplateIds.map((t, i) => {
                    let template = TemplateOp.query(data.templates, t);
                    if (template?.type !== "reward") {
                      return;
                    }
                    let points = v.points;
                    setTimeout(() => {
                      notification.info({
                        message: `🎯 目标：${template!.name}`,
                        description: `距离🎁 ${template!.name} 还有 ${template!.points - (data.points + points)} 点数`,
                        placement: "top",
                        showProgress: true,
                      });
                    }, 700 * i);
                  });
                }
              }}
            />
            <Popconfirm
              okText="确定"
              cancelText="取消"
              title="确定要执行此操作？"
              onConfirm={() => {
                switch (template.type) {
                  case "reward":
                    if (data.points < template.points) {
                      notification.error({
                        message: "点数不足",
                        description: `当前点数：${data.points}，所需点数：${template.points}`,
                        showProgress: true,
                      });
                      return;
                    } else {
                      updateData({
                        ...data,
                        templates: TemplateOp.update(
                          data.templates,
                          template.id,
                          {
                            usedCount: template.usedCount + 1,
                          },
                        ),
                        instances: InstanceOp.add(data.instances, template) as (
                          | QuestInstance
                          | RewardInstance
                        )[],
                        points: data.points - template.points,
                        topTemplateIds:
                          data.topTemplateIds?.includes(template.id) &&
                          template.usedCount + 1 == template.repeatCount
                            ? data.topTemplateIds.filter(
                                (t) => t !== template.id,
                              )
                            : data.topTemplateIds,
                      });
                    }
                    notification.success({
                      message: `🎁 兑换：${template.name}`,
                      description: `消耗 ${template.points} 点数`,
                      showProgress: true,
                    });
                    return;
                  case "quest":
                    setOpenCompleteModal(true);
                    return;
                }
              }}
            >
              <Button
                type="primary"
                icon={
                  template.type === "quest" ? (
                    <FaWineBottle />
                  ) : (
                    <RiShoppingCartLine />
                  )
                }
                disabled={template.usedCount >= template.repeatCount}
                className="absolute right-4 mt-1"
              >
                {template.type === "quest" ? "达成" : "兑换"}
              </Button>
            </Popconfirm>
          </ConfigProvider>
        </>
      }
    </Card>
  );
}

function HistoryInstanceCard({ instance }: { instance: BaseInstance }) {
  const {
    templateName,
    templateDesc,
    templatePoints,
    templatePointsExplan,
    createTime,
  } = instance;
  const [open, setOpen] = useState(false);
  return (
    <Card
      title={
        <Tooltip title={templateName} placement="bottomLeft">
          <p>
            {templateName.length >= 9
              ? `${instance.type === "quest" ? "🏆 " : "🎁 "}` +
                templateName.slice(0, 9) +
                "..."
              : `${instance.type === "quest" ? "🏆 " : "🎁 "}` + templateName}
          </p>
        </Tooltip>
      }
      extra={
        <Tooltip title={templatePointsExplan} placement="bottomLeft">
          <Space
            size={1}
            className={
              instance.type === "quest"
                ? "cursor-help text-orange-600"
                : "cursor-help text-green-700"
            }
          >
            <PiCurrencyDollarSimpleDuotone />
            <p>
              {instance.points === undefined ? templatePoints : instance.points}
            </p>
          </Space>
        </Tooltip>
      }
      className="ml-3 mt-3 h-44 w-64"
    >
      {
        <>
          <div className="flex flex-col gap-1 text-gray-500">
            <Drawer
              open={open}
              onClose={() => setOpen(false)}
              title={(instance.type === "quest" ? "🏆 " : "🎁 ") + templateName}
            >
              <Typography>
                <Typography.Title level={5}>
                  {instance.type === "quest" ? "成就描述" : "奖励描述"}
                </Typography.Title>
                <Typography.Paragraph>{templateDesc}</Typography.Paragraph>
                <Divider />
                {instance.pointsExplan !== undefined &&
                instance.pointsExplan !== undefined ? (
                  <>
                    <Typography.Title level={5}>自评点数</Typography.Title>
                    <Typography.Paragraph>
                      {instance.points}
                    </Typography.Paragraph>
                    <Divider />
                    <Typography.Title level={5}>点数解释</Typography.Title>
                    <Typography.Paragraph>
                      {instance.pointsExplan}
                    </Typography.Paragraph>
                    <Divider />
                  </>
                ) : null}
              </Typography>
            </Drawer>
            <Space>
              <BiDetail />
              <p
                className={
                  instance.type === "quest"
                    ? "text-[#f8861b] underline underline-offset-1 hover:cursor-pointer"
                    : "text-[#22c55e] underline underline-offset-1 hover:cursor-pointer"
                }
                onClick={() => setOpen(true)}
              >
                详情
              </p>
            </Space>
            <Space className="text-gray-400">
              <IoMdTimer />
              <p>
                获得 : {createTime === undefined || null ? "null" : createTime}
              </p>
            </Space>
          </div>
        </>
      }
    </Card>
  );
}

function TodayInstanceCard({ instance }: { instance: BaseInstance }) {
  const { data, updateData } = useContext(UpdateDataContext);
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <HistoryInstanceCard instance={instance} />
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title={
          (instance.type === "quest" ? "🏆 " : "🎁 ") + instance.templateName
        }
      >
        <Typography>
          <Typography.Title level={5}>
            {instance.type === "quest" ? "成就描述" : "奖励描述"}
          </Typography.Title>
          <Typography.Paragraph>{instance.templateDesc}</Typography.Paragraph>
          <Divider />
          {instance.pointsExplan !== undefined &&
          instance.pointsExplan !== undefined ? (
            <>
              <Typography.Title level={5}>自评点数</Typography.Title>
              <Typography.Paragraph>{instance.points}</Typography.Paragraph>
              <Divider />
              <Typography.Title level={5}>点数解释</Typography.Title>
              <Typography.Paragraph>
                {instance.pointsExplan}
              </Typography.Paragraph>
              <Divider />
            </>
          ) : null}
        </Typography>
      </Drawer>
      <div className="absolute left-0 top-0 z-50 ml-3 mt-3 flex h-44 w-64 items-center justify-center rounded-lg bg-[#0000006c]">
        <ConfigProvider
          theme={{
            components: {
              Button: {
                colorPrimary: instance.type === "quest" ? "#f8861b" : "#22c55e",
                algorithm: true,
              },
            },
          }}
        >
          <Button className="mr-3" type="primary" onClick={() => setOpen(true)}>
            详情
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => {
              let templates;
              const template = TemplateOp.query(
                data.templates,
                instance.templateId,
              );
              if (template === undefined) templates = data.templates;
              else
                templates = TemplateOp.update(data.templates, template.id, {
                  usedCount: template.usedCount - 1,
                });
              updateData({
                ...data,
                templates: templates,
                instances: InstanceOp.del(
                  data.instances,
                  instance.instanceId,
                ) as (QuestInstance | RewardInstance)[],
                points:
                  instance.type === "quest" && instance.points !== undefined
                    ? data.points - instance.points
                    : data.points + instance.templatePoints,
              });
              notification.warning({
                message:
                  (instance.type === "quest" ? "🏆 取消：" : "🎁 退还：") +
                  instance.templateName,
                description: `点数 ${instance.type === "quest" && instance.points !== undefined ? instance.points : instance.templatePoints} 已${instance.type === "quest" ? "扣除" : "返还"}`,
                showProgress: true,
              });
            }}
          >
            取消
          </Button>
        </ConfigProvider>
      </div>
    </div>
  );
}

export { TemplateCard, HistoryInstanceCard, TodayInstanceCard };
