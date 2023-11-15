import { assert, string } from 'superstruct';

import { ValidationException } from '../../../utils/exceptions';
import { GenerateUUIDv7StringId, UUIDv7StringId } from '../../shared/model';

export class Chatmessage {
  private chatmessage_id;
  private chatroom_id;
  private receiver_id;
  private sender_id;
  private content;
  //private image_id;
  //private video_id;

  private constructor(params: ConstructorParams) {
    this.chatmessage_id = UUIDv7StringId(params.chatmessage_id);
    this.chatroom_id    = params.chatroom_id ? UUIDv7StringId(params.chatroom_id) : null;
    this.receiver_id    = params.receiver_id ? Username(params.receiver_id) : null;
    this.sender_id      = Username(params.sender_id);
    this.content        = Content(params.content);
    //this.image_id       = params.image_id ? UUIDv7StringId(params.image_id) : undefined;
    //this.video_id       = params.video_id ? UUIDv7StringId(params.video_id) : undefined;
    
    if (this.chatroom_id === null && this.receiver_id === null) {
      throw new ValidationException('Chatmessage must define its chatroom_id or receiver_id.');
    }
    if (this.chatroom_id !== null && this.receiver_id !== null) {
      // chatroom_id means the message is public (to that chatroom)
      // reciever_id means the message is private (to that receiver and sender)
      throw new ValidationException('Chatmessage must be public or private, not both.');
    }
  }

  static create(params: CreateParams) {
    const chatmessage_id = GenerateUUIDv7StringId();
    return new Chatmessage({...params, chatmessage_id});
  }

  getDTO() {
    return {
      chatmessage_id: this.chatmessage_id,
      chatroom_id:    this.chatroom_id,
      receiver_id:    this.receiver_id,
      sender_id:      this.sender_id,
      content:        this.content,
      //image_id:       this.image_id,
      //video_id:       this.video_id
    };
  }
}

export function Username(username: string) {
  assert(username, string());
  if (username.length < 6) {
    throw new ValidationException('Username must be at least 6 characters.');
  }
  if (username.length > 20) {
    throw new ValidationException('Username must be no more than 20 characters.');
  }
  return username;
}

export function Content(content: string) {
  assert(content, string());
  if (content.length > 1000) {
    throw new ValidationException('Chatmessage content must be no more than 1,000 characters.');
  }
  return content;
}

export type CreateParams = {
  chatroom_id?: string;
  receiver_id?: string;
  sender_id:    string;
  content:      string;
  //image_id?:    string;
  //video_id?:    string;
};

export type UpdateParams = CreateParams & {
  chatmessage_id: string;
}

export type ConstructorParams = UpdateParams;
