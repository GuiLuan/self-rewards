import {
  FloatButton,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Space,
} from "antd";
import { GrAdd } from "react-icons/gr";

import { TemplateCard, HistoryInstanceCard, TodayInstanceCard } from "./card";
import { PageType } from "./navigation";
import { useEffect, useState } from "react";
import { useAsyncEffect } from "ahooks";
import { StorageData } from "../struct/data";
import { TemplateOp, readData } from "../utils/data";
import { isToday } from "../utils/common";
import { BaseTemplate } from "../struct/template";
import { UpdatePageContext } from "./ctx";

function TodayPage({ data }: { data: StorageData }) {
  // 筛选出今天创建的instance
  const [instances, setInstances] = useState<StorageData["instances"]>([]);

  useEffect(() => {
    setInstances(
      data.instances.filter((instance) => isToday(instance.createTime)),
    );
  }, [data]);

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

const selectPage = (page: PageType, data: StorageData | {}) => {
  if (data === undefined || Object.keys(data).length === 0) {
    return (
      <div className="relative ml-24 flex flex-1 flex-row flex-wrap place-content-start"></div>
    );
  } else {
    let showPage;
    const _data = data as StorageData;
    switch (page) {
      case "today":
        showPage = <TodayPage data={_data} />;
        break;
      case "quest":
        showPage = <QuestPage data={_data} />;
        break;
      case "reward":
        showPage = <RewardPage data={_data} />;
        break;
      case "history":
        showPage = <HistoryPage data={_data} />;
        break;
    }
    return (
      <div className="relative ml-24 flex flex-1 flex-row flex-wrap place-content-start">
        {showPage}
      </div>
    );
  }
};

function ShowPage({ showPagePos }: { showPagePos: PageType }) {
  const [data, setData] = useState<StorageData | {}>({});
  /* 控制添加表单的开关 */
  const [open, setOpen] = useState(false);
  /* 表单 */
  const [form] = Form.useForm();

  const [update, setUpdate] = useState(0);

  useAsyncEffect(async () => {
    setData(await readData());
    console.log(1);
  }, [update]);

  return (
    <>
      <UpdatePageContext.Provider
        value={{ updatePage: () => setUpdate((prev) => prev + 1) }}
      >
        {selectPage(showPagePos, data)}
      </UpdatePageContext.Provider>

      <FloatButton
        icon={<GrAdd />}
        type="primary"
        onClick={() => setOpen(true)}
      />
      <Modal
        open={open}
        title="新增模板"
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
            onFinish={(f: Omit<BaseTemplate, "id" | "usedCount">) => {
              TemplateOp.add(f).then((value) => {
                setData(value);
                form.resetFields();
              });
              setOpen(false);
            }}
          >
            {dom}
          </Form>
        )}
      >
        <Form.Item name="type" label="类型" required initialValue="quest">
          <Radio.Group>
            <Radio.Button value="quest">成就</Radio.Button>
            <Radio.Button value="reward">奖励</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name={"name"}
          label="名称"
          required
          rules={[{ required: true, message: "请输入名称" }]}
        >
          <Space.Compact>
            <Input></Input>
          </Space.Compact>
        </Form.Item>
        <Form.Item
          name={"desc"}
          label="详情"
          required
          rules={[{ required: true, message: "详情不能为空" }]}
        >
          <Input.TextArea
            autoSize={{ minRows: 2, maxRows: 4 }}
          ></Input.TextArea>
        </Form.Item>
        <Form.Item
          name={"points"}
          label="点数"
          required
          rules={[{ required: true, message: "点数不能为空" }]}
        >
          <InputNumber></InputNumber>
        </Form.Item>
        <Form.Item
          name={"pointsExplan"}
          label="算式"
          required
          tooltip={{ title: "点数计算说明" }}
          rules={[{ required: true, message: "点数说明不能为空" }]}
        >
          <Input.TextArea
            autoSize={{ minRows: 2, maxRows: 4 }}
          ></Input.TextArea>
        </Form.Item>
        <Form.Item
          name={"repeatCount"}
          label="限额"
          required
          tooltip={{ title: "-1表示无限" }}
          rules={[{ required: true, message: "限额不能为空" }]}
        >
          <InputNumber></InputNumber>
        </Form.Item>
      </Modal>
    </>
  );
}

export default ShowPage;
