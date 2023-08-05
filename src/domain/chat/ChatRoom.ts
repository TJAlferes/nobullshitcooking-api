export class ChatRoom {
  private id;
  private name;
  private created_at;
  private updated_at;

  private constructor() {}

  static create() {
    const chatRoom = new ChatRoom();
    return chatRoom;  // only return the id?
  }
}
