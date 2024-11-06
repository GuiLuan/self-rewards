import {
  Card,
  Tooltip,
  Space,
  Button,
  ConfigProvider,
  Dropdown,
  Popconfirm,
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

import { BaseInstance, BaseTemplate } from "../struct";
import { InstanceOp, TemplateOp } from "../utils";
import { UpdateDataContext } from "../context";
import { FormModal } from "./modal";

function TemplateCard({ template }: { template: BaseTemplate }) {
  const [open, setOpen] = useState(false);

  const { data, updateData } = useContext(UpdateDataContext);

  template;
  return (
    <Card
      title={
        <Tooltip title={template.name} placement="bottomLeft">
          <p>
            {template.name.length >= 18
              ? template.name.slice(0, 18) + "..."
              : template.name}
          </p>
        </Tooltip>
      }
      extra={
        <Space>
          <Tooltip title={template.pointsExplan} placement="bottomLeft">
            <Space size={1} className="cursor-help text-green-700">
              <PiCurrencyDollarSimpleDuotone />
              <p>{template.points}</p>
            </Space>
          </Tooltip>
          <Dropdown
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
          <FormModal
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
      className="ml-3 mt-3 h-44 w-64"
    >
      {
        <>
          <div className="flex flex-col gap-1 text-gray-500">
            <Space>
              <BiDetail />
              <Tooltip title={template.desc} placement="bottomLeft">
                <p className="underline underline-offset-1">详情</p>
              </Tooltip>
            </Space>
            <Space
              className={
                template.usedCount >= template.repeatCount ? "text-red-500" : ""
              }
            >
              <IoInfiniteOutline />
              <p>
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
            <Popconfirm
              okText="确定"
              cancelText="取消"
              title="你确定吗？"
              onConfirm={() => {
                updateData({
                  ...data,
                  templates: TemplateOp.update(data.templates, template.id, {
                    usedCount: template.usedCount + 1,
                  }),
                  instances: InstanceOp.add(data.instances, template),
                  points:
                    template.type === "quest"
                      ? data.points + template.points
                      : data.points - template.points,
                });
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
  return (
    <Card
      title={
        <Tooltip title={templateName} placement="bottomLeft">
          <p>
            {templateName.length >= 18
              ? templateName.slice(0, 18) + "..."
              : templateName}
          </p>
        </Tooltip>
      }
      extra={
        <Tooltip title={templatePointsExplan} placement="bottomLeft">
          <Space size={1} className="cursor-help text-green-700">
            <PiCurrencyDollarSimpleDuotone />
            <p>{templatePoints}</p>
          </Space>
        </Tooltip>
      }
      className="ml-3 mt-3 h-44 w-64"
    >
      {
        <>
          <div className="flex flex-col gap-1 text-gray-500">
            <Space>
              <BiDetail />
              <Tooltip title={templateDesc} placement="bottomLeft">
                <p className="underline underline-offset-1">详情</p>
              </Tooltip>
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

  return (
    <div className="relative">
      <HistoryInstanceCard instance={instance} />
      <div className="absolute left-0 top-0 z-50 ml-3 mt-3 flex h-44 w-64 items-center justify-center rounded-lg bg-[#0000006c]">
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
              instances: InstanceOp.del(data.instances, instance.instanceId),
              points:
                instance.type === "quest"
                  ? data.points - instance.templatePoints
                  : data.points + instance.templatePoints,
            });
          }}
        >
          取消
        </Button>
      </div>
    </div>
  );
}

export { TemplateCard, HistoryInstanceCard, TodayInstanceCard };
