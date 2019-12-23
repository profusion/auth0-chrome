export default function base64URLEncode (str: Buffer): string {
  return str.toString('base64')
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=/g, '');
}
