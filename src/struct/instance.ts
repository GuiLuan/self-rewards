/**
 * 基础实例
 *
 * @param templateId 所使用的模板id
 * @param createTime 创建时间，格式为 YYYY-MM-DD HH:mm:ss
 */
interface BaseInstance {
  type: "quest" | "reward";
  instanceId: string;
  templateId: string;
  templateName: string;
  templateDesc: string;
  templatePoints: number;
  templatePointsExplan: string;
  templateRepeatCount: number;
  createTime: string;
  points?: number;
  pointsExplan?: string;
}

interface QuestInstance extends BaseInstance {
  type: "quest";
}

interface RewardInstance extends BaseInstance {
  type: "reward";
}

export type { BaseInstance, QuestInstance, RewardInstance };
