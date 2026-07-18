import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
  // React Compiler 비활성화 상태에서 관련 ESLint 규칙 끄기
  // (비활성화 사유: 프로덕션 빌드에서 컴파일러 버그 재현 — docs/template-guides/development.md 참조)
  {
    rules: {
      'react-compiler/react-compiler': 'off',
      // React Compiler 전용 규칙들 (Compiler 없이는 불필요)
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/globals': 'off',
      'react-hooks/incompatible-library': 'off',
      'react-hooks/static-components': 'off',
    },
  },
  // 미사용 인자/변수는 `_` 접두로 의도 표시 시 허용
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  // no-explicit-any 예외 경계
  // app 코드 전반은 `error`로 엄격하게 유지하되, 아래 경계에서만 any를 허용한다.
  // - manage-modules actions: Supabase 동적 테이블명 기반 insert/update 타이핑 한계
  // - shared/lib/excel: xlsx 서드파티 경계
  // - shared/lib/file-system: 파일 레코드 동적 처리
  // - shared/ui/form: react-hook-form 제네릭 경계
  {
    files: [
      'src/features/manage-modules/**/actions/**/*.ts',
      'src/features/manage-modules/_base/ui/delete-button.tsx',
      'src/shared/lib/excel/**/*.ts',
      'src/shared/lib/file-system/**/*.ts',
      'src/shared/ui/form/**/*.tsx',
      'src/shared/ui/app-dialog/**/*.tsx',
      'src/shared/ui/excel-export-button.tsx',
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
]);

export default eslintConfig;
