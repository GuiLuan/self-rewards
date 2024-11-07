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
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);

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
                    setOpen(true);
                  },
                },
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
                        });
                        notification.warning({
                          message: "删除成功",
                          description: `${template.type === "quest" ? "🏆 成就" : "🎁 奖励"} ${template.name}`,
                        });
                      }}
                    >
                      <p>删除</p>
                    </Popconfirm>
                  ),
                },
                template.type === "reward" && data.trackReward !== template.id
                  ? {
                      key: "track",
                      icon: <FaRegStar />,
                      label: "目标",
                      onClick: () => {
                        updateData({
                          ...data,
                          trackReward: template.id,
                        });
                        notification.success({
                          message: "设置目标",
                          description: `🎁 ${template.name} 被设为目标`,
                        });
                      },
                    }
                  : null,
                template.type === "reward" && data.trackReward === template.id
                  ? {
                      key: "untrack",
                      icon: <FaStar />,
                      label: "取消目标",
                      onClick: () => {
                        updateData({
                          ...data,
                          trackReward: undefined,
                        });
                        notification.warning({
                          message: "取消目标",
                          description: `🎁 ${template.name} 不再是目标`,
                        });
                      },
                    }
                  : null,
              ],
            }}
            className="hover:cursor-pointer"
          >
            <GrMore className="text-gray-500" />
          </Dropdown>
          <TemplateModal
            modalTitle="修改模板"
            open={open}
            setOpen={setOpen}
            onSubmit={(form) => {
              updateData({
                ...data,
                templates: TemplateOp.update(data.templates, template.id, form),
              });
              setOpen(false);
            }}
            initialValues={template}
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
              open={open1}
              setOpen={setOpen1}
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
                });
                if (data.trackReward !== undefined) {
                  notification.info({
                    message: `🎯 目标：${TemplateOp.query(data.templates, data.trackReward)!.name}`,
                    description: `距离🎁 ${TemplateOp.query(data.templates, data.trackReward)!.name} 还有 ${TemplateOp.query(data.templates, data.trackReward)!.points - (data.points + v.points)} 点数`,
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
                      });
                    }
                    notification.success({
                      message: `🎁 兑换：${template.name}`,
                      description: `消耗 ${template.points} 点数`,
                    });
                    return;
                  case "quest":
                    setOpen1(true);
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
