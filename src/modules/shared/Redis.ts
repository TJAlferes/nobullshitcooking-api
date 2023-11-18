import { redisClient } from '../../connections/redis';

// Base abstract class to be extended
export abstract class RedisRepo {
  client = redisClient;
}
