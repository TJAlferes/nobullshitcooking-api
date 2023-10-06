import type { Socket } from "socket.io";

import { FriendshipRepo } from "../user/friendship/repo";
import { ChatUserRepo }   from "./user/repo";

export function chatController(socket: Socket) {
  return {
    async getOnlineFriends({ user_id, username }: GetOnlineFriendsParams) {
      const friendshipRepo = new FriendshipRepo();

      const acceptedFriends = await friendshipRepo.viewAllOfStatus({user_id, status: "accepted"});
      if (acceptedFriends.length < 1) return;
    
      const chatuserRepo = new ChatUserRepo();
      const friends = [];
      for (const acceptedFriend of acceptedFriends) {
        const friend = await chatuserRepo.getByUsername(acceptedFriend.username);
        if (!friend) continue;
    
        socket.broadcast.to(friend).emit('FriendCameOnline', username);
        friends.push(acceptedFriend.username);
      }
      
      socket.emit('OnlineFriends', friends);
    }
  };
}

type GetOnlineFriendsParams = {
  user_id:  string;
  username: string;
};
