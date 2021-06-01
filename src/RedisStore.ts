
import { EventEmitter } from 'events';
import type { SessionData, SessionStore } from '@mgcrea/fastify-session';
import type { Redis } from 'ioredis';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type StoredData = { data: string; expiry: number | null }; // [session data, expiry time in ms]
export type RedisStoreOptions = { client: Redis; prefix?: string; ttl?: number };

export const DEFAULT_PREFIX = 'sess:';
export const DEFAULT_TTL = 86400;

export class RedisStore<T extends SessionData = SessionData> extends EventEmitter implements SessionStore {
  private redis: Redis;
  private readonly prefix: string;
  private readonly ttl: number;

  constructor({ client, prefix = DEFAULT_PREFIX, ttl = DEFAULT_TTL }: RedisStoreOptions) {
    super();
    this.redis = client;
    this.prefix = prefix;
    this.ttl = ttl;
  }

  private getKey(sessionId: string) {
    return `${this.prefix}${sessionId}`;
  }

  // This required method is used to upsert a session into the store given a session ID (sid) and session (session) object.
  async set(sessionId: string, sessionData: T, expiry?: number | null): Promise<void> {
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
  async get(sessionId: string): Promise<[SessionData, number | null] | null> {
    const value = ((await this.redis.hgetall(this.getKey(sessionId))) as unknown) as StoredData | Record<string, never>;
    const isEmpty = Object.keys(value).length === 0;
    return !isEmpty ? [JSON.parse(value.data), value.expiry ? Number(value.expiry) : null] : null;
  }

  // This required method is used to destroy/delete a session from the store given a session ID (sid).
  async destroy(sessionId: string): Promise<void> {
    this.redis.del(this.getKey(sessionId));
    return;
  }

  // This method is used to touch a session from the store given a session ID (sid).
  async touch(sessionId: string, expiry?: number | null): Promise<void> {
    const ttl = expiry ? Math.min(expiry - Date.now(), this.ttl) : this.ttl;
    const key = this.getKey(sessionId);
    await this.redis
      .pipeline()
      .hset(key, 'expiry', `${expiry || ''}`)
      .expire(key, ttl)
      .exec();
    return;
  }
}
