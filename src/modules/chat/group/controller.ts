import { Chatgroup }     from "./model";
import { ChatgroupRepo } from "./repo";

export const chatgroupController = {
  async viewOne() {
    const repo = new ChatgroupRepo();
    const row = await repo.viewOne(chatgroup_id);
  }
};
