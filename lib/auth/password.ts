import { randomBytes, scrypt as nodeScrypt, timingSafeEqual } from "node:crypto"
const SCRYPT_N = 1 << 15
const SCRYPT_R = 8
const SCRYPT_P = 1
const KEY_LENGTH = 64

export function assertStrongPassword(password: string) {
  if (password.length < 12 || password.length > 256) {
    throw new Error("Password must be between 12 and 256 characters.")
  }
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
    throw new Error("Password must contain lowercase, uppercase, and numeric characters.")
  }
}

export async function hashPassword(password: string) {
  assertStrongPassword(password)
  const salt = randomBytes(16)
  const derived = await derive(password, salt, KEY_LENGTH, SCRYPT_N, SCRYPT_R, SCRYPT_P)
  return ["scrypt", SCRYPT_N, SCRYPT_R, SCRYPT_P, salt.toString("base64url"), derived.toString("base64url")].join("$")
}

export async function verifyPassword(password: string, encoded: string) {
  const [algorithm, nText, rText, pText, saltText, digestText] = encoded.split("$")
  if (algorithm !== "scrypt" || !nText || !rText || !pText || !saltText || !digestText) return false

  const n = Number(nText)
  const r = Number(rText)
  const p = Number(pText)
  if (!Number.isSafeInteger(n) || !Number.isSafeInteger(r) || !Number.isSafeInteger(p) || n < 2 ** 14 || n > 2 ** 18 || r < 1 || r > 32 || p < 1 || p > 8) return false

  try {
    const expected = Buffer.from(digestText, "base64url")
    const actual = await derive(password, Buffer.from(saltText, "base64url"), expected.length, n, r, p)
    return expected.length === actual.length && timingSafeEqual(expected, actual)
  } catch {
    return false
  }
}

function derive(password: string, salt: Buffer, keyLength: number, N: number, r: number, p: number) {
  return new Promise<Buffer>((resolve, reject) => {
    nodeScrypt(password, salt, keyLength, { N, r, p, maxmem: 256 * 1024 * 1024 }, (error, derivedKey) => {
      if (error) reject(error)
      else resolve(derivedKey)
    })
  })
}
