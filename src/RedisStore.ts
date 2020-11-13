import { SessionData, SessionStore } from '@mgcrea/fastify-session';
import { EventEmitter } from 'events';
import { Redis } from 'ioredis';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type StoredData = { data: string; expiry: number | null }; // [session data, expiry time in ms]
export type RedisStoreOptions = { client: Redis; prefix?: string; ttl?: number };

export class RedisStore<T extends SessionData = SessionData> extends EventEmitter implements SessionStore {
  private redis: Redis;
  private readonly prefix: string;
  private readonly ttl: number;

  constructor({ client, prefix = 'sess:', ttl = 86400 }: RedisStoreOptions) {
    super();
    this.redis = client;
    this.prefix = prefix;
    this.ttl = ttl;
  }

  private getKey(sessionId: string) {
    return `${this.prefix}${sessionId}`;
  }

  // This required method is used to upsert a session into the store given a session ID (sid) and session (session) object.
  // The callback should be called as callback(error) once the session has been set in the store.
  async set(sessionId: string, sessionData: T, expiry: number | null): Promise<void> {
    const ttl = expiry ? Math.min(expiry - Date.now(), this.ttl) : this.ttl;
    const key = this.getKey(sessionId);
    await this.redis
      .pipeline()
      .hset(key, 'data', JSON.stringify(sessionData), 'expiry', `${expiry || ''}`)
      .expire(key, ttl)
      .exec();
    return;
  }

  // This required method is used to get a session from the store given a session ID (sid).
  // The callback should be called as callback(error, session).
  async get(sessionId: string): Promise<[SessionData, number | null] | null> {
    const value = ((await this.redis.hgetall(this.getKey(sessionId))) as unknown) as StoredData | Record<string, never>;
    const isEmpty = Object.keys(value).length === 0;
    return !isEmpty ? [JSON.parse(value.data), value.expiry ? Number(value.expiry) : null] : null;
  }

  // This required method is used to destroy/delete a session from the store given a session ID (sid).
  // The callback should be called as callback(error) once the session is destroyed.
  async destroy(sessionId: string): Promise<void> {
    this.redis.del(this.getKey(sessionId));
    return;
  }
}
