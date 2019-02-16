export const findAndReplace = (arr, findFn, replaceFn) => {
  const index = arr.findIndex(findFn);
  if (index === -1) {
    return arr;
  }
  const first = arr.slice(0, index);
  const [item, ...last] = arr.slice(index);
  return [...first, replaceFn(item), ...last];
};
