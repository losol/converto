import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';
import onlyWarn from 'eslint-plugin-only-warn';

/**
 * Standalone ESLint config for ConvertoAPI.
 *
 * Vendored from @eventuras/eslint-config (base). The monorepo-specific pieces
 * have been dropped because they don't apply to this standalone Fastify service:
 *   - eslint-plugin-turbo (Turborepo env-var rule, no turbo here)
 *   - eventuras/no-invalid-testid (JSX/React-only, no JSX here)
 *   - eventuras/no-direct-event-sdk-import (targets @eventuras/event-sdk)
 *
 * onlyWarn keeps the monorepo's "warnings not errors" semantics; CI runs
 * `eslint . --max-warnings 0` so any warning still fails the pipeline.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export default [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    plugins: {
      onlyWarn,
    },
  },
  {
    ignores: ['dist/**', 'coverage/**', 'build/**', 'test-results/**'],
  },
];
