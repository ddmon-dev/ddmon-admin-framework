export function transformSnakeToCamel(obj: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()),
      value,
    ])
  );
}
