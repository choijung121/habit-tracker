function randomHex(bytes: number) {
  const buffer = new Uint8Array(bytes);
  const cryptoObj = globalThis.crypto;

  if (cryptoObj?.getRandomValues) {
    cryptoObj.getRandomValues(buffer);
  } else {
    for (let i = 0; i < buffer.length; i += 1) {
      buffer[i] = Math.floor(Math.random() * 256);
    }
  }

  return Array.from(buffer, (value) => value.toString(16).padStart(2, "0")).join("");
}

export function createId(prefix: string) {
  // Not a UUID, but stable and collision-resistant enough for local/offline usage.
  return `${prefix}_${Date.now().toString(36)}_${randomHex(10)}`;
}

