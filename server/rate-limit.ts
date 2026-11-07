interface Counter { count: number; resetAt: number }

export class MemoryRateLimiter {
  private readonly counters = new Map<string, Counter>()
  constructor(private readonly max = 60, private readonly windowMs = 60_000) {}
  allow(key: string): boolean { const current = this.counters.get(key); const now = Date.now(); if (!current || current.resetAt <= now) { this.counters.set(key, { count: 1, resetAt: now + this.windowMs }); return true } if (current.count >= this.max) return false; current.count += 1; return true }
}
