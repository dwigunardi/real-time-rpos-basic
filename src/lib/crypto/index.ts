import CryptoJS from 'crypto-js';

const SECRET = process.env.NEXT_PUBLIC_ENCRYPT_KEY || '';

if (!SECRET) {
  console.warn('NEXT_PUBLIC_ENCRYPT_KEY is not set');
}

// Tipe data payload terenkripsi
export type EncryptedPayload = {
  salt: string;       // hex
  iv: string;         // hex
  ciphertext: string; // base64
};

export function encrypt(text: string): EncryptedPayload {
  if (!text) throw new Error('Encrypt text is required');

  // 1. Generate salt & IV
  const salt = CryptoJS.lib.WordArray.random(16); // 128-bit
  const iv   = CryptoJS.lib.WordArray.random(16); // 128-bit

  // 2. Derive key with PBKDF2
  const key = CryptoJS.PBKDF2(SECRET, salt, {
    keySize: 256 / 32,
    iterations: 1000,
    hasher: CryptoJS.algo.SHA256,
  });

  // 3. Encrypt (AES-256-CBC)
  const encrypted = CryptoJS.AES.encrypt(text, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  // 4. Gabungkan dalam bentuk object (salt + iv + ciphertext)
  return {
    salt: salt.toString(CryptoJS.enc.Hex),
    iv: iv.toString(CryptoJS.enc.Hex),
    ciphertext: encrypted.ciphertext.toString(CryptoJS.enc.Base64),
  };
}

export function decrypt(data: EncryptedPayload): string {
  if (!data?.ciphertext || !data?.salt || !data?.iv) {
    throw new Error('Invalid encrypted payload');
  }

  const salt = CryptoJS.enc.Hex.parse(data.salt);
  const iv   = CryptoJS.enc.Hex.parse(data.iv);

  // Derive key kembali (harus sama dengan encrypt)
  const key = CryptoJS.PBKDF2(SECRET, salt, {
    keySize: 256 / 32,
    iterations: 1000,
    hasher: CryptoJS.algo.SHA256,
  });

  const decrypted = CryptoJS.AES.decrypt(
    { ciphertext: CryptoJS.enc.Base64.parse(data.ciphertext) } as any,
    key,
    {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    },
  );

  const plaintext = decrypted.toString(CryptoJS.enc.Utf8);
  if (!plaintext) {
    throw new Error('Failed to decrypt payload');
  }

  return plaintext;
}