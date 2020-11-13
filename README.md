# fastify-session-redis-store

[![npm version](https://img.shields.io/npm/v/@mgcrea/fastify-session-redis-store.svg)](https://github.com/mgcrea/fastify-session-redis-store/releases)
[![license](https://img.shields.io/npm/l/@mgcrea/fastify-session-redis-store)](https://tldrlegal.com/license/mit-license)
[![build status](https://img.shields.io/github/workflow/status/mgcrea/fastify-session-redis-store/ci)](https://github.com/mgcrea/fastify-session-redis-store/actions)
[![dependencies status](https://img.shields.io/david/mgcrea/fastify-session-redis-store)](https://david-dm.org/mgcrea/fastify-session-redis-store)
[![devDependencies status](https://img.shields.io/david/dev/mgcrea/fastify-session-redis-store)](https://david-dm.org/mgcrea/fastify-session-redis-store?type=dev)

Redis session store for [fastify](https://github.com/fastify/fastify).

- Requires [@mgcrea/fastify-session](https://github.com/mgcrea/fastify-session) to handle sessions.

- Relies on [ioredis](https://github.com/luin/ioredis) to interact with redis.

- Built with [TypeScript](https://www.typescriptlang.org/) for static type checking with exported types along the
  library.

## Usage

```bash
npm install @mgcrea/fastify-session-redis-store
```

```bash
npm install ioredis --save; npm install @types/ioredis --save-dev
# or
yarn add ioredis; yarn add --dev @types/ioredis
```

```ts
import createFastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import fastifyCookie from 'fastify-cookie';
import RedisStore from '@mgcrea/fastify-session-redis-store';
import fastifySession from '@mgcrea/fastify-session';
import Redis from 'ioredis';
import { IS_PROD, IS_TEST, REDIS_URI, SESSION_TTL } from './config/env';

const SESSION_TTL = 864e3; // 1 day in seconds

export const buildFastify = (options?: FastifyServerOptions): FastifyInstance => {
  const fastify = createFastify(options);

  fastify.register(fastifyCookie);
  fastify.register(fastifySession, {
    store: new RedisStore({ client: new Redis(REDIS_URI), ttl: SESSION_TTL }),
    secret: 'a secret with minimum length of 32 characters',
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
