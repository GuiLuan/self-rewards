import { QuestTemplate, RewardTemplate } from "./template";
import { QuestInstance, RewardInstance } from "./instance";

interface StorageData {
  templates: (QuestTemplate | RewardTemplate)[];
  instances: (QuestInstance | RewardInstance)[];
  points: number;
  topTemplateIds?: string[];
}

const emptyData: StorageData = {
  templates: [],
  instances: [],
  points: 0,
};

export { emptyData };
export type { StorageData };
