import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    ".agents/**",
    ".claude/**",
    ".claude-flow/**",
    ".codex/**",
    "inspirations/**"
  ]),
  {
    rules: {
      "react/no-unescaped-entities": "off",
      "react-hooks/set-state-in-effect": "off",
      "@next/next/no-html-link-for-pages": "off"
    }
  },
  {
    // Ignore strict rules for imported Vercel AI Chatbot reference components
    files: [
      "src/components/ai-elements/**/*",
      "src/components/chat/**/*",
      "src/components/dashboard/tabs/**/*",
      "src/components/ui/**/*",
      "src/hooks/**/*",
      "src/app/api/chat/**/*",
      "src/lib/types.ts"
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "react-hooks/refs": "off",
      "react-hooks/static-components": "off",
      "react-hooks/exhaustive-deps": "off",
      "@next/next/no-img-element": "off"
    }
  }
]);

export default eslintConfig;
