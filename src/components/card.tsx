import {
  Card,
  Tooltip,
  Space,
  Button,
  ConfigProvider,
  Dropdown,
  Popconfirm,
  Modal,
  Form,
  Input,
  InputNumber,
} from "antd";
import { IoMdTimer } from "react-icons/io";
import { BiDetail } from "react-icons/bi";
import { PiCurrencyDollarSimpleDuotone } from "react-icons/pi";
import { FaWineBottle } from "react-icons/fa";
import { IoInfiniteOutline } from "react-icons/io5";
import { RiShoppingCartLine } from "react-icons/ri";
import { GrMore } from "react-icons/gr";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";

import { BaseTemplate } from "../struct/template";
import { BaseInstance } from "../struct/instance";
import { InstanceOp, TemplateOp } from "../utils/data";
import { useContext, useState } from "react";
import { PointsContext, UpdatePageContext } from "./ctx";

function TemplateCard({ template }: { template: BaseTemplate }) {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const { points: globalPoints, setPoints: setGlobalPoints } =
    useContext(PointsContext);
  const { updatePage } = useContext(UpdatePageContext);

  const { type, id, name, desc, points, pointsExplan, repeatCount, usedCount } =
    template;
  return (
    <Card
      title={
        <Tooltip title={name} placement="bottomLeft">
          <p>{name.length >= 18 ? name.slice(0, 18) + "..." : name}</p>
        </Tooltip>
      }
      extra={
        <Space>
          <Tooltip title={pointsExplan} placement="bottomLeft">
            <Space size={1} className="cursor-help text-green-700">
              <PiCurrencyDollarSimpleDuotone />
              <p>{points}</p>
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
                        TemplateOp.del(id);
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
          <Modal
            open={open}
            title="修改模板"
            okText="确认"
            cancelText="取消"
            okButtonProps={{
              autoFocus: true,
              htmlType: "submit",
            }}
            onCancel={() => setOpen(false)}
            modalRender={(dom) => (
              <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                form={form}
                name="form_in_modal"
                clearOnDestroy
                variant="filled"
                onFinish={(f) => {
                  TemplateOp.update(id, f);
                  setOpen(false);
                }}
              >
                {dom}
              </Form>
            )}
          >
            <Form.Item
              name={"name"}
              label="名称"
              required
              rules={[{ required: true, message: "请输入名称" }]}
              initialValue={name}
            >
              <Space.Compact>
                <Input defaultValue={name}></Input>
              </Space.Compact>
            </Form.Item>
            <Form.Item
              name={"desc"}
              label="详情"
              required
              rules={[{ required: true, message: "详情不能为空" }]}
              initialValue={desc}
            >
              <Input.TextArea
                autoSize={{ minRows: 2, maxRows: 4 }}
                defaultValue={desc}
              ></Input.TextArea>
            </Form.Item>
            <Form.Item
              name={"points"}
              label="点数"
              required
              rules={[{ required: true, message: "点数不能为空" }]}
              initialValue={points}
            >
              <InputNumber defaultValue={points}></InputNumber>
            </Form.Item>
            <Form.Item
              name={"pointsExplan"}
              label="算式"
              required
              tooltip={{ title: "点数计算说明" }}
              rules={[{ required: true, message: "点数说明不能为空" }]}
              initialValue={pointsExplan}
            >
              <Input.TextArea
                autoSize={{ minRows: 2, maxRows: 4 }}
                defaultValue={pointsExplan}
              ></Input.TextArea>
            </Form.Item>
            <Form.Item
              name={"repeatCount"}
              label="限额"
              required
              tooltip={{ title: "-1表示无限" }}
              rules={[{ required: true, message: "限额不能为空" }]}
              initialValue={repeatCount}
            >
              <InputNumber defaultValue={repeatCount}></InputNumber>
            </Form.Item>
          </Modal>
        </Space>
      }
      className="ml-3 mt-3 h-44 w-64"
    >
      {
        <>
          <div className="flex flex-col gap-1 text-gray-500">
            <Space>
              <BiDetail />
              <Tooltip title={desc} placement="bottomLeft">
                <p className="underline underline-offset-1">详情</p>
              </Tooltip>
            </Space>
            <Space className={usedCount >= repeatCount ? "text-red-500" : ""}>
              <IoInfiniteOutline />
              <p>
                次数 : {usedCount} / {repeatCount}
              </p>
            </Space>
          </div>
          <ConfigProvider
            theme={{
              components: {
                Button: {
                  colorPrimary: type === "quest" ? "#f8861b" : "#22c55e",
                  algorithm: true,
                },
              },
            }}
          >
            <Button
              type="primary"
              icon={
                type === "quest" ? <FaWineBottle /> : <RiShoppingCartLine />
              }
              onClick={() => {
                setGlobalPoints(globalPoints + points);
                InstanceOp.add(id);
                updatePage();
              }}
              disabled={usedCount >= repeatCount}
              className="absolute right-4 mt-1"
            >
              {type === "quest" ? "达成" : "兑换"}
            </Button>
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
  const { updatePage } = useContext(UpdatePageContext);
  const { points, setPoints } = useContext(PointsContext);
  return (
    <div className="relative">
      <HistoryInstanceCard instance={instance} />
      <div className="absolute left-0 top-0 z-50 ml-3 mt-3 flex h-44 w-64 items-center justify-center rounded-lg bg-[#0000006c]">
        <Button
          type="primary"
          danger
          onClick={() => {
            setPoints(points - instance.templatePoints);
            InstanceOp.del(instance.instanceId, instance.templateId);
            updatePage();
          }}
        >
          取消
        </Button>
      </div>
    </div>
  );
}

export { TemplateCard, HistoryInstanceCard, TodayInstanceCard };
