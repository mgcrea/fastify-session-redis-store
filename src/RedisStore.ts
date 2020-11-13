import { SessionData, SessionStore } from '@mgcrea/fastify-session';
import { EventEmitter } from 'events';
import { Redis } from 'ioredis';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type StoredData<T> = [T, number | null]; // [session data, expiry time in ms]
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
  async set(sessionId: string, session: T, expiry: number | null): Promise<void> {
    const ttl = expiry ? Math.min(expiry - Date.now(), this.ttl) : this.ttl;
    await this.redis.set(this.getKey(sessionId), JSON.stringify([session, expiry]), 'EX', ttl);
    return;
  }

  // This required method is used to get a session from the store given a session ID (sid).
  // The callback should be called as callback(error, session).
  async get(sessionId: string): Promise<StoredData<T> | null> {
    const value = await this.redis.get(this.getKey(sessionId));
    return value ? JSON.parse(value) : null;
  }

  // This required method is used to destroy/delete a session from the store given a session ID (sid).
  // The callback should be called as callback(error) once the session is destroyed.
  async destroy(sessionId: string): Promise<void> {
    this.redis.del(this.getKey(sessionId));
    return;
  }
}
