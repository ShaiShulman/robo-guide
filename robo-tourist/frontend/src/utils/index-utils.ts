export const findNonUniqueIndexes = (list: any[]) => {
  const nonUniqueIndexes: number[] = [];

  for (let i = 0; i < list.length; i++) {
    const value = list[i];

    if (
      list
        .slice(0, i)
        .concat(list.slice(i + 1))
        .includes(value)
    ) {
      nonUniqueIndexes.push(i);
    }
  }

  return nonUniqueIndexes;
};
