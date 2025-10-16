/**
 * AI Usage Migration Utility
 * 
 * This utility migrates AI usage data from localStorage to the Supabase database.
 * Should be run once when user logs in after the migration is deployed.
 */

import { supabase } from '@/lib/supabase/client'
import { getAIUsageKey, type AIUsage } from '@/lib/ai-limits'
import { logger } from '@/lib/logger'

export interface MigrationResult {
  success: boolean
  migrated: boolean
  message: string
}

/**
 * Migrate AI usage data from localStorage to database
 * @param userId User ID to migrate data for
 * @param userPlan Current user plan
 * @returns Migration result
 */
export async function migrateAIUsageToDatabase(
  userId: string,
  userPlan: 'basic' | 'professional' | 'premium'
): Promise<MigrationResult> {
  try {
    // Check if already migrated (record exists in database)
    const { data: existingRecord } = await supabase
      .from('ai_usage')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle()

    if (existingRecord) {
      return {
        success: true,
        migrated: false,
        message: 'Dados já foram migrados anteriormente'
      }
    }

    // Try to get data from localStorage
    const usageKey = getAIUsageKey(userId)
    const localDataStr = localStorage.getItem(usageKey)

    if (!localDataStr) {
      // No local data, create fresh record
      const { error } = await supabase
        .from('ai_usage')
        .insert({
          user_id: userId,
          plan: userPlan,
          question_count: 0,
          last_reset_date: new Date().toISOString()
        })

      if (error) throw error

      return {
        success: true,
        migrated: false,
        message: 'Novo registro criado (sem dados locais)'
      }
    }

    // Parse local data
    const localData: AIUsage = JSON.parse(localDataStr)

    // Migrate to database
    const { error } = await supabase
      .from('ai_usage')
      .insert({
        user_id: userId,
        plan: userPlan,
        question_count: localData.count || 0,
        last_reset_date: localData.lastReset || new Date().toISOString()
      })

    if (error) throw error

    // Clean up localStorage after successful migration
    localStorage.removeItem(usageKey)

    logger.dev('AI usage migrated successfully:', {
      userId,
      count: localData.count,
      lastReset: localData.lastReset
    })

    return {
      success: true,
      migrated: true,
      message: `Migrado com sucesso: ${localData.count} perguntas`
    }

  } catch (error: any) {
    logger.error('Error migrating AI usage:', error)
    return {
      success: false,
      migrated: false,
      message: `Erro na migração: ${error.message}`
    }
  }
}

/**
 * Auto-migrate AI usage when user context loads
 * Call this in AuthProvider or similar initialization
 */
export async function autoMigrateAIUsage(
  userId: string | undefined,
  userPlan: 'basic' | 'professional' | 'premium' | undefined
): Promise<void> {
  if (!userId || !userPlan) return

  try {
    const result = await migrateAIUsageToDatabase(userId, userPlan)
    
    if (result.migrated) {
      logger.dev('Auto-migration completed:', result.message)
    }
  } catch (error) {
    logger.error('Auto-migration failed:', error)
    // Don't throw - migration failure shouldn't break the app
  }
}
