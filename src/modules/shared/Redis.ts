import { redisClients } from "../../connections/redis";

// Base abstract class to be extended
export abstract class RedisRepo {
  client = redisClients.pubClient;
}
