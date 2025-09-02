export async function tryCatch<R>(callback: () => Promise<R>): Promise<[R, string | null]> {
  try {
    const res = await callback();
    return [res, null];
  } catch (err) {
    return [null, err.message];
  }
}
