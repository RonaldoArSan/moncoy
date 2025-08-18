export interface AIUsage {
  count: number
  lastReset: string
  plan: string
}

export function getAIUsageKey(userId: string): string {
  return `ai_usage_${userId}`
}

export function checkAILimit(plan: string, currentUsage: AIUsage): { allowed: boolean; remaining: number; resetDate: Date } {
  const now = new Date()
  const lastReset = new Date(currentUsage.lastReset)
  
  let limit = 0
  let resetPeriod = 'week' // default
  
  switch (plan) {
    case 'basic':
      limit = 5
      resetPeriod = 'week'
      break
    case 'pro':
      limit = 7
      resetPeriod = 'week'
      break
    case 'premium':
      limit = 50
      resetPeriod = 'month'
      break
  }
  
  // Calculate next reset date
  let nextReset = new Date(lastReset)
  if (resetPeriod === 'week') {
    nextReset.setDate(lastReset.getDate() + 7)
  } else {
    nextReset.setMonth(lastReset.getMonth() + 1)
  }
  
  // Check if we need to reset the counter
  const shouldReset = now >= nextReset
  const count = shouldReset ? 0 : currentUsage.count
  
  return {
    allowed: count < limit,
    remaining: Math.max(0, limit - count),
    resetDate: shouldReset ? now : nextReset
  }
}

export function incrementAIUsage(currentUsage: AIUsage): AIUsage {
  return {
    ...currentUsage,
    count: currentUsage.count + 1
  }
}