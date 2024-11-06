import {
  Form,
  Modal,
  Input,
  Radio,
  Space,
  InputNumber,
  Upload,
  UploadFile,
} from "antd";

import { BaseTemplate } from "../struct";
import { fileToBase64 } from "../utils";
import { useState } from "react";

function TemplateModal({
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

  const [fileList, setFileList] = useState<UploadFile[]>([]);

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
            console.log(values);
            // 上传了文件，则提取 response
            if (values.base64 !== undefined && typeof values.base64 !== "string") {
              values.base64 = values.base64.file.response;
            }
            onSubmit(values);
            form.resetFields();
            setFileList([]);
          }}
        >
          {dom}
        </Form>
      )}
    >
      <Form.Item
        name="type"
        label="类型"
        required
        initialValue={
          initialValues?.type === undefined ? "quest" : initialValues.type
        }
      >
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
          <Input defaultValue={initialValues?.name} />
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
        <InputNumber defaultValue={initialValues?.points} />
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
        />
      </Form.Item>
      <Form.Item
        name={"repeatCount"}
        label="限额"
        required
        rules={[{ required: true, message: "限额不能为空" }]}
        initialValue={initialValues?.repeatCount}
      >
        <InputNumber defaultValue={initialValues?.repeatCount} />
      </Form.Item>
      <Form.Item
        name={"base64"}
        label="图片"
        required
        rules={[{ required: true, message: "图片不能为空" }]}
        initialValue={initialValues?.base64}
      >
        <Upload
          customRequest={(props) =>
            fileToBase64(props.file as File).then((res) =>
              props.onSuccess!(res),
            )
          }
          listType="picture-card"
          fileList={fileList}
          onChange={({ fileList }) => setFileList(fileList)}
        >
          {fileList.length >= 1 ? null : <p>点击上传</p>}
        </Upload>
      </Form.Item>
    </Modal>
  );
}

function InstanceModal({
  open,
  setOpen,
  onSubmit,
  maxPoints,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (values: { points: number; pointsExplan: string }) => void;
  maxPoints: number;
}) {
  const [form] = Form.useForm();

  return (
    <Modal
      open={open}
      title={"自我评估"}
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
          onFinish={(v) => {
            onSubmit(v);
            setOpen(false);
            form.resetFields();
          }}
        >
          {dom}
        </Form>
      )}
    >
      <Form.Item
        name={"points"}
        label="点数"
        required
        rules={[
          { required: true, message: "点数不能为空" },
          {
            type: "number",
            max: maxPoints,
            message: `点数不能超过${maxPoints}`,
          },
          {
            type: "number",
            min: 0,
            message: "点数不能小于0",
          },
        ]}
      >
        <InputNumber max={maxPoints} min={0} />
      </Form.Item>
      <Form.Item
        name={"pointsExplan"}
        label="记录"
        required
        rules={[{ required: true, message: "记录不能为空" }]}
      >
        <Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
      </Form.Item>
    </Modal>
  );
}

export { TemplateModal, InstanceModal };
