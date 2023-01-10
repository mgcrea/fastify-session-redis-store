/* eslint-disable @typescript-eslint/no-namespace */
import type { warn } from "console";

declare global {
  const d: typeof warn;
  namespace NodeJS {
    interface Global {
      d: typeof d;
    }
  }
}
