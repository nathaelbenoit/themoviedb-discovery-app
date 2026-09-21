import { defineConfig } from "oxlint";

export default defineConfig({
  plugins: ["typescript", "unicorn", "oxc", "react"],
  categories: {
    correctness: "error",
  },
  rules: {},
  env: {
    builtin: true,
  },
});