import {
  BaseDirectory,
  exists,
  readTextFile,
  writeTextFile,
} from "@tauri-apps/plugin-fs";

import { emptyData, StorageData } from "../struct/data";
import { BaseTemplate } from "../struct/template";
import { genenrateId, getCurTime } from "./common";
import { BaseInstance } from "../struct/instance";

/* 开发环境存放在桌面，生产环境存放在安装之后APP文件夹 */
const DATA_DIR = import.meta.env.DEV
  ? BaseDirectory.Desktop
  : BaseDirectory.AppData;
const DATA_FILE = "data.json";

/**
 * 将 File 转换为 Base64 格式的字符串
 */
const fileToBase64 = async (file: File) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  return new Promise((resolve, reject) => {
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
  });
};

/**
 * 覆盖性写入
 * @param data 待写入的数据，会覆盖已有的所有数据
 */
const writeData = async (data: StorageData) => {
  await writeTextFile(DATA_FILE, JSON.stringify(data), {
    baseDir: DATA_DIR,
  });
};

/**
 * 读取所有数据
 * @returns 如果没有读取到数据，返回 EmptyData
 */
const readData = async () => {
  const flag = await exists(DATA_FILE, {
    baseDir: DATA_DIR,
  });
  switch (flag) {
    // 有文件，读取并返回
    case true:
      return JSON.parse(
        await readTextFile(DATA_FILE, {
          baseDir: DATA_DIR,
        }),
      ) as StorageData;
    // 没有文件，创建文件，写入 EmptyData，并返回 EmptyData
    case false:
      await writeTextFile(DATA_FILE, JSON.stringify(emptyData), {
        baseDir: DATA_DIR,
      });
      return emptyData;
  }
};

class TemplateOp {
  /**
   * 追加模板
   *
   * @remarks
   * 不会与同名模板冲突，不会修改入参
   *
   * @returns 添加模板之后的完整数据
   */
  static add(
    templates: BaseTemplate[],
    template: Omit<BaseTemplate, "id" | "usedCount">,
  ) {
    // 生成ID | 置零使用次数
    Object.assign(template, {
      id: genenrateId(),
      usedCount: 0,
    });

    return [...templates, template as BaseTemplate];
  }

  /**
   * 删除模板
   *
   * @remarks
   * - ID是唯一的，理论上不会存在错误删除的情况
   * - 不会修改入参
   *
   * @returns 删除给定模板之后的完整数据
   *
   */
  static del(templates: BaseTemplate[], templateId: string) {
    return templates.filter((template) => template.id !== templateId);
  }

  /**
   * 查询模板
   *
   * @returns 如果模板不存在，返回 undefined
   */
  static query(templates: BaseTemplate[], templateId: string) {
    return templates.find((template) => template.id === templateId);
  }

  /**
   * 更新模板
   *
   * @remarks
   * - 如果模板不存在，返回元数据
   * - 不会修改入参
   */
  static update(
    templates: BaseTemplate[],
    templateId: string,
    updateFileds: Partial<BaseTemplate>,
  ) {
    return templates.map((template) =>
      template.id === templateId ? { ...template, ...updateFileds } : template,
    );
  }
}

class InstanceOp {
  /* 根据模板生成实例 */
  static generate(template: BaseTemplate) {
    return {
      type: template.type,
      instanceId: genenrateId(),
      templateId: template.id,
      templateName: template.name,
      templateDesc: template.desc,
      templatePoints: template.points,
      templatePointsExplan: template.pointsExplan,
      templateRepeatCount: template.repeatCount,
      createTime: getCurTime(),
    } as BaseInstance;
  }

  /* 添加实例 */
  static add(instances: BaseInstance[], template: BaseTemplate) {
    const newInstance = this.generate(template);
    return [...instances, newInstance];
  }

  /* 删除实例 */
  static del(instances: BaseInstance[], instanceId: string) {
    return instances.filter((instance) => instance.instanceId !== instanceId);
  }
}

export { readData, writeData, TemplateOp, InstanceOp, fileToBase64 };
