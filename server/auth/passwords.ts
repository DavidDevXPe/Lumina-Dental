import argon2 from 'argon2'

export function hashPassword(password: string): Promise<string> {
  if (password.length < 12) throw new Error('La contraseña debe tener al menos 12 caracteres.')
  return argon2.hash(password, { type: argon2.argon2id })
}

export function verifyPassword(hash: string, password: string): Promise<boolean> {
  return argon2.verify(hash, password)
}
