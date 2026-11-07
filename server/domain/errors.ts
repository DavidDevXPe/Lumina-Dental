export class DomainError extends Error {
  constructor(public readonly code: string, message: string, public readonly statusCode = 400, public readonly fieldErrors?: Record<string, string>) {
    super(message)
    this.name = 'DomainError'
  }
}

export class ConflictError extends DomainError {
  constructor(message = 'La franja ya no está disponible.') {
    super('AVAILABILITY_CONFLICT', message, 409)
  }
}
