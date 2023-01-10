# FastifySession RedisStore

<!-- markdownlint-disable MD033 -->
<p align="center">
  <a href="https://www.npmjs.com/package/@mgcrea/fastify-session-redis-store">
    <img src="https://img.shields.io/npm/v/@mgcrea/fastify-session-redis-store.svg?style=for-the-badge" alt="npm version" />
  </a>
  <a href="https://www.npmjs.com/package/@mgcrea/fastify-session-redis-store">
    <img src="https://img.shields.io/npm/dt/@mgcrea/fastify-session-redis-store.svg?style=for-the-badge" alt="npm total downloads" />
  </a>
  <a href="https://www.npmjs.com/package/@mgcrea/fastify-session-redis-store">
    <img src="https://img.shields.io/npm/dm/@mgcrea/fastify-session-redis-store.svg?style=for-the-badge" alt="npm monthly downloads" />
  </a>
  <a href="https://www.npmjs.com/package/@mgcrea/fastify-session-redis-store">
    <img src="https://img.shields.io/npm/l/@mgcrea/fastify-session-redis-store.svg?style=for-the-badge" alt="npm license" />
  </a>
  <br />
  <a href="https://github.com/mgcrea/fastify-session-redis-store/actions/workflows/main.yml">
    <img src="https://img.shields.io/github/actions/workflow/status/mgcrea/fastify-session-redis-store/main.yml?style=for-the-badge&branch=master" alt="build status" />
  </a>
  <a href="https://depfu.com/github/mgcrea/fastify-session-redis-store">
    <img src="https://img.shields.io/depfu/dependencies/github/mgcrea/fastify-session-redis-store?style=for-the-badge" alt="dependencies status" />
  </a>
</p>
<!-- markdownlint-enable MD037 -->

## Features

Redis session store for [fastify](https://github.com/fastify/fastify).

- Requires [@mgcrea/fastify-session](https://github.com/mgcrea/fastify-session) to handle sessions.

- Relies on [ioredis](https://github.com/luin/ioredis) to interact with redis.

- Built with [TypeScript](https://www.typescriptlang.org/) for static type checking with exported types along the
  library.

## Usage

```sh
npm install @mgcrea/fastify-session @mgcrea/fastify-session-redis-store
# or
pnpm add @mgcrea/fastify-session @mgcrea/fastify-session-redis-store
```

```sh
npm install ioredis --save; npm install @types/ioredis --save-dev
# or
pnpm add ioredis; pnpm add --save-dev @types/ioredis
```

```ts
import createFastify, { FastifyInstance, FastifyServerOptions } from "fastify";
import fastifyCookie from "fastify-cookie";
import RedisStore from "@mgcrea/fastify-session-redis-store";
import fastifySession from "@mgcrea/fastify-session";
import Redis from "ioredis";
import { IS_PROD, IS_TEST, REDIS_URI, SESSION_TTL } from "./config/env";

const SESSION_TTL = 864e3; // 1 day in seconds

export const buildFastify = (options?: FastifyServerOptions): FastifyInstance => {
  const fastify = createFastify(options);

  fastify.register(fastifyCookie);
  fastify.register(fastifySession, {
    store: new RedisStore({ client: new Redis(REDIS_URI), ttl: SESSION_TTL }),
    secret: "a secret with minimum length of 32 characters",
    cookie: { maxAge: SESSION_TTL },
  });

  return fastify;
};
```

## Authors

- [Olivier Louvignes](https://github.com/mgcrea) <<olivier@mgcrea.io>>

### Credits

- [tj/connect-redis](https://github.com/tj/connect-redis)

## License

```
The MIT License

Copyright (c) 2020 Olivier Louvignes <olivier@mgcrea.io>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
