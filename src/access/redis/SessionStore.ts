import { Redis } from 'ioredis';

const SESSION_TTL = 24 * 60 * 60;

const mapSession = ([ userId, username, connected ]: (string|null)[]) =>
  userId ? {userId, username, connected: connected === "true"} : undefined;

// TO DO: change any any types and merge with old code
export class SessionStore implements ISessionStore {
  redisClient: Redis;

  constructor(redisClient: Redis) {
    this.redisClient = redisClient;
    this.get = this.get.bind(this);
    this.getById = this.getById.bind(this);
    this.save = this.save.bind(this);
  }

  async get() {
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
      .then(results =>
        results
          .map(([ err, session ]) => err ? undefined : mapSession(session))
          .filter(v => !!v)
      );
  }

  getById(id: string) {
    return this.redisClient
      .hmget(`session:${id}`, "userId", "username", "connected")
      .then(mapSession);
  }

  save(id: string, { userId, username, connected }: ISessionInfoAsStr) {
    this.redisClient
      .multi()
      .hset(
        `session:${id}`,
        "userId", userId, "username", username, "connected", connected
      )
      .expire(`session:${id}`, SESSION_TTL)
      .exec();
  }
}

interface ISessionStore {
  get(): Promise< (ISessionInfo | undefined)[] >;
  getById(id: string): Promise<ISessionInfo | undefined>;
  save(id: string, sessionInfo: ISessionInfoAsStr): void;
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