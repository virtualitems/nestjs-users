import * as crypto from 'node:crypto';

import * as base64 from './base64url';

type SignOptions = {
  algorithm?: string;
};

export function pack(
  id: string,
  ttl: number,
  secret: string,
  options?: SignOptions,
): string {
  const algorithm = options?.algorithm ?? 'sha256';
  const expiration = Date.now() + ttl;
  const data = `${id}.${expiration}`;

  const signature = crypto
    .createHmac(algorithm, secret)
    .update(data)
    .digest('hex');

  const algBase64 = base64.encode(algorithm);
  const idBase64 = base64.encode(id);
  const sigBase64 = base64.encode(signature);
  const expBase64 = base64.encode(expiration.toString());

  return `${algBase64}.${idBase64}.${expBase64}.${sigBase64}`;
}

export function unpack(token: string, secret: string): string {
  const parts = token.split('.');

  if (parts.length !== 4) {
    throw new Error('Invalid token');
  }

  const [algorithm, id, expiration, signature] = parts.map((o) =>
    base64.decode(o),
  );

  const data = `${id}.${expiration}`;

  const hash = crypto.createHmac(algorithm, secret).update(data).digest('hex');

  if (hash !== signature) {
    throw new Error('Invalid token');
  }

  if (Date.now() > Number(expiration)) {
    throw new Error('Token expired');
  }

  return id;
}
