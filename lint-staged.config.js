export default {
  "*.{js,ts}": ["eslint --quiet --fix", "vitest related --run"],
  "*.{json,js,ts,html,md,css}": ["prettier --write --ignore-unknown"],
};
