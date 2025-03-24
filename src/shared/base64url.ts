export function encode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function decode(
  value: string,
  encoding: BufferEncoding = 'utf-8',
): string {
  const m = value.length % 4;
  return Buffer.from(
    value
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(value.length + (m === 0 ? 0 : 4 - m), '='),
    'base64',
  ).toString(encoding);
}
