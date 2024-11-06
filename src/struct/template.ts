/**
 * 基础模板
 *
 * @param id 模板id
 * @param name 模板名称
 * @param desc 模板描述
 * @param points 奖励点数(收入/支出)
 * @param pointsExplan 奖励点数说明(收入/支出)
 * @param repeatCount 模板可重复使用次数，-1表示无限次
 */
interface BaseTemplate {
  type: "quest" | "reward";
  id: string;
  name: string;
  desc: string;
  points: number;
  pointsExplan: string;
  repeatCount: number;
  usedCount: number;
  base64?: string;
}

interface QuestTemplate extends BaseTemplate {
  type: "quest";
}

interface RewardTemplate extends BaseTemplate {
  type: "reward";
}

export type { BaseTemplate, QuestTemplate, RewardTemplate };
