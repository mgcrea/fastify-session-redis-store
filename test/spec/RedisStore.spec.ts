/* eslint-disable */
import Redis from "ioredis";
import { DEFAULT_PREFIX, RedisStore } from "src/RedisStore";
import { afterAll, describe, expect, it } from "vitest";

const REDIS_PORT = process.env["REDIS_PORT"] || 6379;
const REDIS_HOST = process.env["REDIS_HOST"] || "localhost";
const REDIS_URI = process.env["REDIS_URI"] || `redis://${REDIS_HOST}:${REDIS_PORT}/1`;
const TTL = 120;
const SHORT_TTL = 12;

describe("RedisStore", () => {
  const redisClient = new Redis(REDIS_URI);
  const store = new RedisStore({ client: redisClient, ttl: TTL });
  const minExpiry = Date.now();
  const context = new Map<string, any>([
    ["id", "QLwqf4XJ1dmkiT41RB0fM"],
    ["data", { foo: "bar" }],
  ]);

  afterAll(() => {
    redisClient.disconnect();
  });

  it("should properly set a key", async () => {
    const result = await store.set(context.get("id"), context.get("data"));
    expect(result).toBeUndefined();
    const sessionData = await redisClient.hgetall(`${DEFAULT_PREFIX}${context.get("id")}`);
    expect(sessionData["data"]).toEqual(JSON.stringify(context.get("data")));
    expect(typeof sessionData["expiry"]).toBe("string");
    const ttl = await redisClient.ttl(`${DEFAULT_PREFIX}${context.get("id")}`);
    expect(ttl).toEqual(TTL);
  });
  it("should properly set a key with a shorter expiry", async () => {
    const result = await store.set(context.get("id"), context.get("data"), Date.now() + SHORT_TTL * 1e3);
    expect(result).toBeUndefined();
    const sessionData = await redisClient.hgetall(`${DEFAULT_PREFIX}${context.get("id")}`);
    expect(sessionData["data"]).toEqual(JSON.stringify(context.get("data")));
    expect(typeof sessionData["expiry"]).toBe("string");
    const ttl = await redisClient.ttl(`${DEFAULT_PREFIX}${context.get("id")}`);
    expect(ttl).toEqual(SHORT_TTL);
  });
  it("should properly get a key", async () => {
    const result = await store.get(context.get("id"));
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBeTruthy();
    expect(result![0]).toEqual(context.get("data"));
    expect(result![1] && result![1] > minExpiry).toBeTruthy();
  });
  it("should properly destroy a key", async () => {
    const result = await store.destroy(context.get("id"));
    expect(result).toBeUndefined();
    const result2 = await store.get(context.get("id"));
    expect(result2).toBe(null);
  });
  it("should properly touch a key", async () => {
    await store.set(context.get("id"), context.get("data"));
    await waitFor(1000);
    // const beforeData = await redisClient.hgetall(`${DEFAULT_PREFIX}${context.get('id')}`);
    const beforeTTL = await redisClient.ttl(`${DEFAULT_PREFIX}${context.get("id")}`);
    expect(beforeTTL).toEqual(TTL - 1);
    const result = await store.touch(context.get("id"));
    // const afterData = await redisClient.hgetall(`${DEFAULT_PREFIX}${context.get('id')}`);
    expect(result).toBeUndefined();
    const afterTTL = await redisClient.ttl(`${DEFAULT_PREFIX}${context.get("id")}`);
    expect(afterTTL).toEqual(TTL);
  });
  it("should properly touch a key with a shorter expiry", async () => {
    await store.set(context.get("id"), context.get("data"));
    await waitFor(1000);
    // const beforeData = await redisClient.hgetall(`${DEFAULT_PREFIX}${context.get('id')}`);
    const beforeTTL = await redisClient.ttl(`${DEFAULT_PREFIX}${context.get("id")}`);
    expect(beforeTTL).toEqual(TTL - 1);
    const result = await store.touch(context.get("id"), Date.now() + SHORT_TTL * 1e3);
    // const afterData = await redisClient.hgetall(`${DEFAULT_PREFIX}${context.get('id')}`);
    expect(result).toBeUndefined();
    const afterTTL = await redisClient.ttl(`${DEFAULT_PREFIX}${context.get("id")}`);
    expect(afterTTL).toEqual(SHORT_TTL);
  });
});

const waitFor = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
