import "express-session";

// find a better way, get rid of this pollution

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