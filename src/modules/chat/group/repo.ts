//import { RowDataPacket } from "mysql2";

import { MySQLRepo } from "../../shared/MySQL";

export class ChatgroupRepo extends MySQLRepo implements ChatgroupRepoInterface {
  //async search

  async overviewAll(user_id: string) {
    // For a logged in and connected user,
    // a list of chatgroups they are members of
    const sql = `
      SELECT
        cg.chatgroup_id,
        cg.chatgroup_name
      FROM chatgroup cg
      INNER JOIN chatgroup_user cgu ON cgu.chatgroup_id = cg.chatgroup_id
      WHERE cgu.user_id = :user_id
    `;
    const [ row ] = await this.pool.execute<ChatgroupView[]>(sql, user_id);
    return row;
  }

  //async viewOne({ user_id, chatgroup_id }: ViewOneParams) {}

  async insert(params: InsertParams) {
    const sql = `
      INSERT INTO chatgroup (
        chatgroup_id,
        owner_id,
        chatgroup_name,
        invite_code
      ) VALUES (
        :chatgroup_id,
        :owner_id,
        :chatgroup_name,
        :invite_code
      )
    `;
    await this.pool.execute(sql, params);
  }

  async update({ chatgroup_name, owner_id, chatgroup_id }: UpdateParams) {
    const sql = `
      UPDATE chatgroup
      SET
        chatgroup_name = :chatgroup_name
      WHERE owner_id = :owner_id AND chatgroup_id = :chatgroup_id
      LIMIT 1
    `;
    await this.pool.execute(sql, {
      chatgroup_name,
      owner_id,
      chatgroup_id
    });
  }

  //async generateNewInviteCode
  //async changeOwner

  async deleteOne({ owner_id, chatgroup_id }: DeleteOneParams) {
    const sql = `
      DELETE FROM chatgroup
      WHERE owner_id = :owner_id AND chatgroup_id = :chatgroup_id
      LIMIT 1
    `;
    await this.pool.execute(sql, {owner_id, chatgroup_id});
  }
}

export interface ChatgroupRepoInterface {
  insert:    (params: InsertParams) =>    Promise<void>;
  update:    (params: UpdateParams) =>    Promise<void>;
  deleteOne: (params: DeleteOneParams) => Promise<void>;
}

type InsertParams = {
  chatgroup_id:   string;
  owner_id:       string;
  chatgroup_name: string;
  invite_code:    string;
};

type UpdateParams = InsertParams;

type ViewOneParams = {
  owner_id:     string;
  chatgroup_id: string;
};

type DeleteOneParams = ViewOneParams;
