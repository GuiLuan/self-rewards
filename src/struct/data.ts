import { QuestTemplate, RewardTemplate } from "./template";
import { QuestInstance, RewardInstance } from "./instance";

interface StorageData {
  templates: (QuestTemplate | RewardTemplate)[];
  instances: (QuestInstance | RewardInstance)[];
  points: number;
}

export type { StorageData };
