export const splitResponse = (response: string) => {
  const regex = /^\d+\. (.*)$/gm;
  const matches = response.matchAll(regex);
  const items: string[] = [];

  for (const match of matches) {
    items.push(match[1]);
  }

  return items;
};
