export type DbFallbackResult<T> = {
  data: T;
  databaseConnectionError: boolean;
};

export async function withDbFallback<T>(load: () => Promise<T>, fallback: T): Promise<DbFallbackResult<T>> {
  try {
    return {
      data: await load(),
      databaseConnectionError: false
    };
  } catch {
    return {
      data: fallback,
      databaseConnectionError: true
    };
  }
}
