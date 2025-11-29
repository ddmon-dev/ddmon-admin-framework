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
  ]),
  // React Compiler 비활성화 상태에서 관련 ESLint 규칙 끄기
  {
    rules: {
      "react-compiler/react-compiler": "off",
      // React Compiler 전용 규칙들 (Compiler 없이는 불필요)
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
      "react-hooks/globals": "off",
      "react-hooks/incompatible-library": "off",
      "react-hooks/static-components": "off",
    },
  },
]);

export default eslintConfig;
