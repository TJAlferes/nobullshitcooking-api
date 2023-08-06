import { Socket } from 'socket.io';

import { IChatStore } from '../access/redis';

export async function joinRoom({ room, sessionId, username, socket, chatStore }: IJoinRoom) {
  if (room === '') return;

  const currentRooms = socket.rooms;
  // change to array and change to for of?
  for (const currentRoom in currentRooms) {
    if (currentRoom !== sessionId) {
      socket.leave(currentRoom);
      chatStore.removeUserFromRoom(username, currentRoom);  // chatroomUserRepo.removeUserFromChatroom({user_id, chatroom_id})
      socket.broadcast.to(currentRoom).emit('UserLeftRoom', username);
    }
  }

  socket.join(room);
  chatStore.createRoom(room);  // chatroomRepo.create(chatroomName);
  chatStore.addUserToRoom(username, room);  // chatroomUserRepo.addUserToChatroom({user_id, chatroom_id})
  socket.broadcast.to(room).emit('UserJoinedRoom', username);

  const users = await chatStore.getUsersInRoom(room);  // chatroomUserRepo.viewUsersInChatroom(chatroomName)
  socket.emit('UsersInroom', users, room);
}

interface IJoinRoom {
  room:      string;
  sessionId: string;
  username:  string;
  socket:    Socket;
  chatStore: IChatStore;
}
