export const to = async (promise: Promise<any>) => {
  try {
    const res = await promise;
    return [null, res];
  } catch (err) {
    return [err, null];
  }
}

export const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}