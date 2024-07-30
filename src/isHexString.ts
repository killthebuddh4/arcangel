export const isHex = (value: string) => {
  const n = parseInt(value, 16);

  if (isNaN(n)) {
    return false;
  }

  return true;
};
