/**
 * @type {{ test?: import('vitest').InlineConfig }}
 */
export default {
  test: {
    bail: 3,
    logHeapUsage: true,
    globals: true,
    include: ['./src/**/*.test.*'],
    coverage: {
      enabled: true,
      all: true,
      provider: 'v8',
      extension: ['.js'],
      allowExternal: false,
      include: ['**/src/**'],
      exclude: ['**/node_modules/**', '**/playground/**'],
    },
  },
};
