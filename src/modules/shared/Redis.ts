import { redisClients } from "../../connections/redis.js";

// Base abstract class to be extended
export abstract class RedisRepo {
  client = redisClients.pubClient;
}
