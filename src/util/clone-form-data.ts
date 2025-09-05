export function cloneFormData(payload: FormData) {
  const fd = new FormData();
  for (const [key, val] of payload) {
    fd.set(key, val);
  }
  console.log('Cloned fd: ', fd);
  return fd;
}
