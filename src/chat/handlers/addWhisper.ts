import { Socket } from 'socket.io';

import { IFriendship } from '../../mysql-access/Friendship';
import { IUser } from '../../mysql-access/User';
import { IMessengerUser } from '../../redis-access/MessengerUser';
import { ChatUser } from '../entities/ChatUser';
import { Whisper } from '../entities/Whisper';

export async function addWhisper({
  whisperText,
  to,
  userId,
  username,
  avatar,
  socket,
  messengerUser,
  nobscFriendship,
  nobscUser
}: IAddWhisper) {
  const [ userExists ] = await nobscUser.getUserByName(to);

  if (!userExists.length) {
    return socket.emit('FailedWhisper', 'User not found.');
  }



  const [ blockedUsers ] = await nobscFriendship
  .viewMyBlockedUsers(userExists[0].user_id);

  const blockedByUser = blockedUsers
  .find((friend: any) => friend.user_id === userId);

  if (blockedByUser) return socket.emit('FailedWhisper', 'User not found.');



  const onlineUser = await messengerUser
  .getUserSocketId(userExists[0].user_id);

  if (!onlineUser) return socket.emit('FailedWhisper', 'User not found.');



  const whisper = Whisper(
    whisperText,
    to,
    ChatUser(userId, username, avatar)
  );

  socket.broadcast.to(onlineUser).emit('AddWhisper', whisper);
  socket.emit('AddWhisper', whisper);
}

interface IAddWhisper {
  whisperText: string;
  to: string;
  userId: number;
  username: string;
  avatar: string;
  socket: Socket;
  messengerUser: IMessengerUser;
  nobscFriendship: IFriendship;
  nobscUser: IUser;
}