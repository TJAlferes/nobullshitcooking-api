import type { Socket } from "socket.io";

import { FriendshipRepo }   from "../user/friendship/repo";
import { ChatroomUserRepo } from "./room/user/repo";
import { ChatuserRepo }     from "./user/repo";

// chatService???
export const chatController = {
  async getOnlineFriends({ session_id, username, socket }: GetOnlineFriendsParams) {
    const friendshipRepo = new FriendshipRepo();
    const acceptedFriends = await friendshipRepo.viewAccepted(session_id);
    if (!acceptedFriends.length) return;
  
    const chatuserRepo = new ChatuserRepo();
    const friends = [];
    for (const acceptedFriend of acceptedFriends) {
      const friend = await chatStore.getUserSessionId(acceptedFriend.username);
      if (!friend) continue;
  
      socket.broadcast.to(friend).emit('FriendCameOnline', username);
      friends.push(acceptedFriend.username);
    }
    
    socket.emit('OnlineFriends', friends);
  },

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
    const chatuserRepo   = new ChatuserRepo();
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

type GetOnlineFriendsParams = {
  session_id: string;
  username:   string;
  socket:     Socket;
};

type DisconnectingParams = {
  session_id: string;
  user_id:    string;
  username:   string;
  socket:     Socket;
};
