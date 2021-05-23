import "express-session";

declare module "express-session" {
  interface SessionData {
    staffInfo?: {
      id: number;
      staffname: string;
    };
    userInfo?: {
      id: number;
      username: string;
    };
  }
}