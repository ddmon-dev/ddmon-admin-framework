/**
 * snake_case 문자열을 camelCase로 변환하는 타입
 * @example
 * CamelCase<"created_at"> → "createdAt"
 * CamelCase<"user_created_at"> → "userCreatedAt"
 */
type CamelCase<S extends string> = S extends `${infer Head}_${infer Tail}`
  ? `${Lowercase<Head>}${Capitalize<CamelCase<Tail>>}`
  : S;

/**
 * 객체의 모든 키를 snake_case에서 camelCase로 변환하는 타입
 * @example
 * CamelCaseKeys<{ created_at: string }> → { createdAt: string }
 */
export type CamelCaseKeys<T> = {
  [K in keyof T as CamelCase<string & K>]: T[K];
};

/**
 * snake_case 객체를 camelCase 객체로 변환
 * DB 조회 결과를 프론트에서 사용할 때 유용할 듯
 * @example
 * transformSnakeToCamel({ created_at: "2024" })
 * // → { createdAt: "2024" }
 */
export function transformSnakeToCamel<T extends Record<string, any>>(obj: T): CamelCaseKeys<T> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()),
      value,
    ])
  ) as CamelCaseKeys<T>;
}

/**
 * camelCase 문자열을 snake_case로 변환하는 타입
 * @example
 * SnakeCase<"createdAt"> → "created_at"
 * SnakeCase<"userCreatedAt"> → "user_created_at"
 */
type SnakeCase<S extends string> = S extends `${infer Head}${infer Tail}`
  ? Tail extends Uncapitalize<Tail>
    ? `${Lowercase<Head>}${SnakeCase<Tail>}`
    : `${Lowercase<Head>}_${SnakeCase<Tail>}`
  : S;

/**
 * camelCase 객체를 snake_case 객체로 변환
 * @example
 * transformCamelToSnake({ createdAt: "2024" })
 * // → { created_at: "2024" }
 */
export type SnakeCaseKeys<T> = {
  [K in keyof T as SnakeCase<string & K>]: T[K];
};

/**
 * camelCase 객체를 snake_case 객체로 변환
 * @example
 * transformCamelToSnake({ createdAt: "2024" })
 * // → { created_at: "2024" }
 */
export function transformCamelToSnake<T extends Record<string, any>>(obj: T): SnakeCaseKeys<T> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      const snakeCasedKey = key
        .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
        .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2')
        .toLowerCase();
      return [snakeCasedKey, value];
    })
  ) as SnakeCaseKeys<T>;
}
