export default {
  '*.js': ['prettier --write', 'eslint --cache --fix', 'vitest related --run'],
  '*.{json,md}': ['prettier --write'],
};
