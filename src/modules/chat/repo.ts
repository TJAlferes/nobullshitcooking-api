async getUserSessionId(username: string) {
  const session_id = await chatuserRepo.getSessionId(username);
  return session_id;
}

async createUser({ session_id, username }: Chatuser) {
  await chatuserRepo.insert({session_id, username});
}

async deleteUser(username: string) {
  await chatuserRepo.delete(username);
}

export interface IChatStore {
  getUserSessionId(username: string): Promise<string | null>;
  createUser(params: Chatuser):       void;
  deleteUser(username: string):       void;
}

type Chatuser = {
  session_id: string;
  username:   string;
};
