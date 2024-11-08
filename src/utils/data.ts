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
   * @returns 添加模板之后的完整数据和模板的ID
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

    return {
      templates: [...templates, template as BaseTemplate],
      id: (template as BaseTemplate).id,
    };
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

  /**
   * 排序模板，points升序排序，再按照 usedCount / repeatCount 升序排序
   *
   * @param templates 模板列表
   * @param topArrayIds 需要置顶的模板ID列表
   */
  static sort(templates: BaseTemplate[], topArrayIds?: string[]) {
    function sortFunc(a: BaseTemplate, b: BaseTemplate) {
      if (a.usedCount === a.repeatCount && b.usedCount !== b.repeatCount) {
        // 将“用完”的放在后面
        return 1;
      } else if (
        a.usedCount !== a.repeatCount &&
        b.usedCount === b.repeatCount
      ) {
        // 将“没用完”的放在前面
        return -1;
      } else if (
        a.usedCount === a.repeatCount &&
        b.usedCount === b.repeatCount
      ) {
        // 如果都“用完”了，保持原顺序不变
        return 0;
      } else {
        if (a.points !== b.points) {
          // 如果都没“用完”，先按照点数升序排序
          return a.points - b.points;
        } else {
          // 点数相同的，再按照 usedCount / repeatCount 升序排序
          return a.usedCount / a.repeatCount - b.usedCount / b.repeatCount;
        }
      }
    }
    return topArrayIds === undefined
      ? templates.sort(sortFunc)
      : [
          ...topArrayIds.map((e) => templates.find((t) => t.id === e)!),
          ...templates
            .filter((t) => !topArrayIds.includes(t.id))
            .sort(sortFunc),
        ];
  }
}

class InstanceOp {
  /* 根据模板生成实例 */
  static generate(
    template: BaseTemplate,
    points?: number,
    pointsExplan?: string,
  ) {
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
      points,
      pointsExplan,
    } as BaseInstance;
  }

  /* 添加实例 */
  static add(
    instances: BaseInstance[],
    template: BaseTemplate,
    points?: number,
    pointsExplan?: string,
  ) {
    const newInstance = this.generate(template, points, pointsExplan);
    return [...instances, newInstance];
  }

  /* 删除实例 */
  static del(instances: BaseInstance[], instanceId: string) {
    return instances.filter((instance) => instance.instanceId !== instanceId);
  }
}

export { readData, writeData, TemplateOp, InstanceOp, fileToBase64 };
