import type { Socket } from "socket.io";

import { FriendshipRepo }   from "../user/friendship/repo";
import { ChatroomUserRepo } from "./room/user/repo";

// chatService???
export const chatController = {
  async disconnecting({ session_id, user_id, username, socket }: DisconnectingParams) {
    const clonedSocket: Partial<Socket> = {...socket};
    
    const chatroomUserRepo = new ChatroomUserRepo();
    for (const room in clonedSocket.rooms) {
      if (room !== session_id) {
        socket.broadcast.to(room).emit('UserLeftRoom', username);
        await chatroomUserRepo.removeUserFromChatroom({user_id, chatroom_id});
      }
    }
  
    const friendshipRepo = new FriendshipRepo();
    const friends = await friendshipRepo.viewAccepted(user_id);
    if (friends.length) {
      for (const friend of friends) {
        const onlineFriend = await chatuserRepo.getUserSessionId(friend.username);
        if (!onlineFriend) continue;
        socket.broadcast.to(onlineFriend).emit('FriendWentOffline', username);
      }
    }
  
    chatuserRepo.deleteUser(username);
  }
};

type DisconnectingParams = {
  session_id: string;
  user_id:    string;
  username:   string;
  socket:     Socket;
};
