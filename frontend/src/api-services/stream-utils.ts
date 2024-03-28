export const getStreamedResponse = async (
  url: string,
  onNewValueRead: (line: string, value: string) => void,
  onStreamEnd: () => void,
  signal?: AbortSignal
) => {
  const response = await fetch(url, {
    signal,
  });
  if (!response.ok) throw new Error("Error! bad response from server.");

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let line = "";
  while (true) {
    const { value, done } = await reader.read();
    const decodedValue = decoder.decode(value, { stream: true });
    if (done) {
      onStreamEnd();
      break;
    }
    line += decodedValue;
    onNewValueRead(line, decodedValue);
  }
};
