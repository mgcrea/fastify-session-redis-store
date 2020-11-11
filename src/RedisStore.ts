import session from 'fastify-session';
import { EventEmitter } from 'events';
import { Redis } from 'ioredis';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type RedisStoreOptions<_T> = { client: Redis; prefix?: string; ttl?: number };

export class RedisStore<T = Record<string, unknown>> extends EventEmitter implements session.SessionStore {
  private redis: Redis;
  private readonly prefix: string;
  private readonly ttl: number;

  constructor({ client, prefix = 'sess:', ttl = 86400 }: RedisStoreOptions<T>) {
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
  set(sessionId: string, session: T, callback: (err?: Error) => void): void {
    this.redis
      .set(this.getKey(sessionId), JSON.stringify(session), 'EX', this.ttl)
      .then(() => callback())
      .catch((err) => callback(err));
  }

  // This required method is used to get a session from the store given a session ID (sid).
  // The callback should be called as callback(error, session).
  get(sessionId: string, callback: (err?: Error, session?: T | null) => void): void {
    this.redis
      .get(this.getKey(sessionId))
      .then((value) => {
        callback(undefined, value ? JSON.parse(value) : null);
      })
      .catch((error) => callback(error, null));
  }

  // This required method is used to destroy/delete a session from the store given a session ID (sid).
  // The callback should be called as callback(error) once the session is destroyed.
  destroy(sessionId: string, callback: (err?: Error) => void): void {
    this.redis
      .del(this.getKey(sessionId))
      .then(() => callback())
      .catch((error) => callback(error));
  }
}
