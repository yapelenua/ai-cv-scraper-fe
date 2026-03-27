export function parsePossiblyStringifiedJson<T>(input: unknown): T {
  if (typeof input === 'string') {
    const first = JSON.parse(input) as unknown
    if (typeof first === 'string') return JSON.parse(first) as T
    return first as T
  }

  return input as T
}
