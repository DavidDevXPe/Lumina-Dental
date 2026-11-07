import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { DomainError } from './domain/errors.js'

export function sendApiError(reply: FastifyReply, request: FastifyRequest, error: unknown) {
  const requestId = String(request.id)
  if (error instanceof DomainError) return reply.code(error.statusCode).send({ code: error.code, message: error.message, ...(error.fieldErrors ? { fieldErrors: error.fieldErrors } : {}), requestId })
  const fastifyError = error as FastifyError
  if (fastifyError.code === 'FST_ERR_VALIDATION') return reply.code(400).send({ code: 'VALIDATION_ERROR', message: 'Revisa los datos enviados.', fieldErrors: {}, requestId })
  request.log.error({ err: error, requestId }, 'request failed')
  return reply.code(500).send({ code: 'INTERNAL_ERROR', message: 'No se pudo completar la solicitud.', requestId })
}
