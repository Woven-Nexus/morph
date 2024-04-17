import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  './packages/posix-path-browser/vite.config.ts',
  './packages/client/vite.config.ts',
  './packages/html-module-plugin/vite.config.ts',
  './packages/forge/vite.config.ts',
  './packages/editor/vite.config.ts',
  './packages/components/vite.config.ts',
  './packages/editor/demo/vite.config.ts',
]);
