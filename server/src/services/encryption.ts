//Checking the crypto module
import crypto from 'crypto';
const key = Buffer.from(
  'b7ad2e1ba79118d0566493e63702cd4d897db149355076b6488f9f0151df5f4b',
  'hex'
);
const iv = Buffer.from('af49e68a713b4499d4cdeb1badb513a5', 'hex');

export type cypher = {
  encryptedData: string;
  iv: string;
};

//Encrypting text
export function encrypt(text: string): cypher {
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

// Decrypting text
export function decrypt(text: cypher) {
  const iv = Buffer.from(text.iv, 'hex');
  const encryptedText = Buffer.from(text.encryptedData, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
