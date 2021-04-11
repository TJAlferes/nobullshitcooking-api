import { Redis } from 'ioredis';

const SESSION_TTL = 24 * 60 * 60;

const mapSession = ([ userId, username, connected ]: (string|null)[]) =>
  userId ? {userId, username, connected: connected === "true"} : undefined;

// TO DO: change any any types and merge with old code
export class SessionStore implements ISessionStore {
  redisClient: Redis;

  constructor(redisClient: Redis) {
    this.redisClient = redisClient;
  }

  findSession(id: string) {
    return this.redisClient
      .hmget(`session:${id}`, "userId", "username", "connected")
      .then(mapSession);
  }

  saveSession(id: string, { userId, username, connected }: ISessionInfoAsStr) {
    this.redisClient
      .multi()
      .hset(
        `session:${id}`,
        "userId", userId, "username", username, "connected", connected
      )
      .expire(`session:${id}`, SESSION_TTL)
      .exec();
  }

  async findAllSessions() {
    const keys = new Set<string>();
    let nextIdx = 0;
    
    do {

      const [ nextIdxAsStr, results ] = await this.redisClient
        .scan(nextIdx, "MATCH", "session:*", "COUNT", 100);

      nextIdx = parseInt(nextIdxAsStr, 10);

      results.forEach(s => keys.add(s));

    } while (nextIdx !== 0);

    const commands: string[][] = [];

    keys.forEach(key => {
      commands.push(["hmget", key, "userId", "username", "connected"]);
    });

    return this.redisClient
      .multi(commands)
      .exec()
      .then(
        results => results
          .map(([ err, session ]) => err ? undefined : mapSession(session))
          .filter(v => !!v)
      );
  }
}

interface ISessionStore {
  findSession(id: string): Promise<ISessionInfo | undefined>;
  saveSession(
    id: string,
    { userId, username, connected }: ISessionInfoAsStr
  ): void;
  findAllSessions(): Promise< (ISessionInfo | undefined)[] >;
}

interface ISessionInfo {
  userId: string;
  username: string | null;
  connected: boolean;
}

interface ISessionInfoAsStr {
  userId: string;
  username: string;
  connected: string;
}