import {
  BaseDirectory,
  exists,
  readTextFile,
  writeTextFile,
} from "@tauri-apps/plugin-fs";

import { StorageData } from "../struct/data";
import { BaseTemplate } from "../struct/template";
import { genenrateId, getCurTime } from "./common";
import { BaseInstance } from "../struct/instance";

const DATA_DIR = import.meta.env.DEV
  ? BaseDirectory.Desktop
  : BaseDirectory.AppData;
const DATA_FILE = "data.json";

/**
 * 读取所有数据
 * @returns 如果没有读取到数据，返回{}；反之，返回所有数据
 */
const readData = async () => {
  const flag = await exists(DATA_FILE, {
    baseDir: DATA_DIR,
  });
  if (flag === true) {
    const data = await readTextFile(DATA_FILE, {
      baseDir: DATA_DIR,
    });
    return JSON.parse(data) as StorageData;
  } else {
    const emptyData: StorageData = {
      templates: [],
      instances: [],
      points: 0,
    };
    await writeTextFile(DATA_FILE, JSON.stringify(emptyData), {
      baseDir: DATA_DIR,
    });
    return emptyData;
  }
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

class TemplateOp {
  /* 追加模板 */
  static async add(template: Omit<BaseTemplate, "id" | "usedCount">) {
    const data = await readData();
    if (Object.keys(data).length === 0) {
      return {};
    }
    const _data = data as StorageData;
    Object.assign(template, {
      id: genenrateId(),
      usedCount: 0,
    });
    _data.templates.push(template as BaseTemplate);
    writeData(_data);
    return _data;
  }

  /* 删除模板 */
  static async del(templateId: string) {
    const data = await readData();
    if (Object.keys(data).length === 0) {
      return {};
    } else if ((data as StorageData).templates.length === 0) {
      return {};
    }
    const _data = data as StorageData;
    _data.templates = _data.templates.filter(
      (template) => template.id !== templateId,
    );
    writeData(_data);
    return _data;
  }

  /* 更新模板 */
  static async update(templateId: string, updateFileds: Partial<BaseTemplate>) {
    const data = await readData();
    if (Object.keys(data).length === 0) {
      return {};
    }
    const _data = data as StorageData;
    const template = _data.templates.find(
      (template) => template.id === templateId,
    );
    if (template) {
      Object.assign(template, updateFileds);
      writeData(_data);
    }
    return _data;
  }

  /* 查询模板 */
  static async query(templateId: string) {
    const data = await readData();
    if (Object.keys(data).length === 0) {
      return {};
    }
    const _data = data as StorageData;
    return _data.templates.find((template) => template.id === templateId);
  }
}

class InstanceOp {
  /* 添加实例 */
  static async add(templateId: string) {
    const data = await readData();
    if (Object.keys(data).length === 0) {
      return {};
    }

    const _data = data as StorageData;
    const template = _data.templates.find(
      (template) => template.id === templateId,
    );
    if (template) {
      template.usedCount++;
      const instance: BaseInstance = {
        type: template.type,
        instanceId: genenrateId(),
        templateId: template.id,
        templateName: template.name,
        templateDesc: template.desc,
        templatePoints: template.points,
        templatePointsExplan: template.pointsExplan,
        templateRepeatCount: template.repeatCount,
        createTime: getCurTime(),
      };
      _data.instances.push(instance);
      writeData(_data);
      return _data;
    } else {
      return {};
    }
  }

  /* 删除实例 */
  static async del(instanceId: string, templateId: string) {
    const data = await readData();
    if (Object.keys(data).length === 0) {
      return {};
    }
    const _data = data as StorageData;
    const template = _data.templates.find(
      (template) => template.id === templateId,
    );
    if (template) {
      template.usedCount--;
      if (template.usedCount < 0) {
        template.usedCount = 0;
      }
    }
    _data.instances = _data.instances.filter(
      (instance) => instance.instanceId !== instanceId,
    );
    writeData(_data);
    return _data;
  }
}

const updatePoints = async (points: number) => {
  const data = await readData();
  if (Object.keys(data).length === 0) {
    return {};
  }
  const _data = data as StorageData;
  _data.points = points;
  console.log(_data);
  writeData(_data);
};

export { readData, writeData, TemplateOp, InstanceOp, updatePoints };
