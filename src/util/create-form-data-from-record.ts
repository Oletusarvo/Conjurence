export function createFormDataFromRecord(record: Record<string, unknown>) {
  const fd = new FormData();
  const entries = Object.entries(record);
  for (const [key, val] of entries) {
    fd.set(key, typeof val === 'string' ? val : JSON.stringify(val));
  }
  return fd;
}
