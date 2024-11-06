import { Form, Modal, Input, Radio, Space, InputNumber } from "antd";

import { BaseTemplate } from "../struct";

function FormModal({
  modalTitle,
  open,
  setOpen,
  onSubmit,
  initialValues,
}: {
  modalTitle: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (values: BaseTemplate) => void;
  initialValues?: Partial<BaseTemplate>;
}) {
  const [form] = Form.useForm();
  return (
    <Modal
      open={open}
      title={modalTitle}
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
          onFinish={(values) => {
            onSubmit(values);
            form.resetFields();
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
        initialValue={initialValues?.name}
      >
        <Space.Compact>
          <Input defaultValue={initialValues?.name}></Input>
        </Space.Compact>
      </Form.Item>
      <Form.Item
        name={"desc"}
        label="详情"
        required
        rules={[{ required: true, message: "详情不能为空" }]}
        initialValue={initialValues?.desc}
      >
        <Input.TextArea
          autoSize={{ minRows: 2, maxRows: 4 }}
          defaultValue={initialValues?.desc}
        ></Input.TextArea>
      </Form.Item>
      <Form.Item
        name={"points"}
        label="点数"
        required
        rules={[{ required: true, message: "点数不能为空" }]}
        initialValue={initialValues?.points}
      >
        <InputNumber defaultValue={initialValues?.points}></InputNumber>
      </Form.Item>
      <Form.Item
        name={"pointsExplan"}
        label="算式"
        required
        tooltip={{ title: "点数计算说明" }}
        rules={[{ required: true, message: "点数说明不能为空" }]}
        initialValue={initialValues?.pointsExplan}
      >
        <Input.TextArea
          autoSize={{ minRows: 2, maxRows: 4 }}
          defaultValue={initialValues?.pointsExplan}
        ></Input.TextArea>
      </Form.Item>
      <Form.Item
        name={"repeatCount"}
        label="限额"
        required
        tooltip={{ title: "-1表示无限" }}
        rules={[{ required: true, message: "限额不能为空" }]}
        initialValue={initialValues?.repeatCount}
      >
        <InputNumber defaultValue={initialValues?.repeatCount}></InputNumber>
      </Form.Item>
    </Modal>
  );
}

export { FormModal };
