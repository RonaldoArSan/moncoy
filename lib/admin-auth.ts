/**
 * Admin Authentication Library
 * Handles authentication for independent admin users
 * Separate from regular application user authentication
 */

import { supabaseAdmin } from './supabase-admin'
import * as bcrypt from 'bcryptjs'
import * as crypto from 'crypto'

export interface AdminUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'super_admin'
  is_active: boolean
  last_login?: string
  created_at: string
  updated_at: string
}

export interface AdminSession {
  id: string
  admin_user_id: string
  token: string
  expires_at: string
  created_at: string
}

export interface AdminAuthResult {
  success: boolean
  error?: string
  user?: AdminUser
  session?: AdminSession
}

const SESSION_DURATION_HOURS = 8 // Admin sessions expire after 8 hours

/**
 * Authenticate an admin user with email and password
 */
export async function authenticateAdmin(
  email: string,
  password: string,
  ipAddress?: string,
  userAgent?: string
): Promise<AdminAuthResult> {
  try {
    // Fetch admin user by email
    const { data: adminUser, error: fetchError } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single()

    if (fetchError || !adminUser) {
      return { success: false, error: 'Invalid credentials' }
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, adminUser.password_hash)
    
    if (!isValidPassword) {
      return { success: false, error: 'Invalid credentials' }
    }

    // Generate session token
    const token = crypto.randomBytes(64).toString('hex')
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + SESSION_DURATION_HOURS)

    // Create session
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('admin_sessions')
      .insert({
        admin_user_id: adminUser.id,
        token,
        expires_at: expiresAt.toISOString(),
        ip_address: ipAddress,
        user_agent: userAgent
      })
      .select()
      .single()

    if (sessionError) {
      return { success: false, error: 'Failed to create session' }
    }

    // Update last login
    await supabaseAdmin
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', adminUser.id)

    // Remove sensitive data
    const { password_hash, ...userWithoutPassword } = adminUser

    return {
      success: true,
      user: userWithoutPassword as AdminUser,
      session: session as AdminSession
    }
  } catch (error) {
    console.error('Admin authentication error:', error)
    return { success: false, error: 'Authentication failed' }
  }
}

/**
 * Verify an admin session token
 */
export async function verifyAdminSession(token: string): Promise<AdminAuthResult> {
  try {
    // Clean up expired sessions first
    await supabaseAdmin.rpc('cleanup_expired_admin_sessions')

    // Fetch session
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('admin_sessions')
      .select('*, admin_users(*)')
      .eq('token', token)
      .single()

    if (sessionError || !session) {
      return { success: false, error: 'Invalid or expired session' }
    }

    // Check if session is expired
    if (new Date(session.expires_at) < new Date()) {
      await supabaseAdmin
        .from('admin_sessions')
        .delete()
        .eq('id', session.id)
      
      return { success: false, error: 'Session expired' }
    }

    // Check if admin user is still active
    if (!session.admin_users.is_active) {
      return { success: false, error: 'Admin account is inactive' }
    }

    // Remove sensitive data
    const { password_hash, ...userWithoutPassword } = session.admin_users

    return {
      success: true,
      user: userWithoutPassword as AdminUser,
      session: {
        id: session.id,
        admin_user_id: session.admin_user_id,
        token: session.token,
        expires_at: session.expires_at,
        created_at: session.created_at
      }
    }
  } catch (error) {
    console.error('Session verification error:', error)
    return { success: false, error: 'Session verification failed' }
  }
}

/**
 * Logout admin user by invalidating session
 */
export async function logoutAdmin(token: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabaseAdmin
      .from('admin_sessions')
      .delete()
      .eq('token', token)

    if (error) {
      return { success: false, error: 'Logout failed' }
    }

    return { success: true }
  } catch (error) {
    console.error('Admin logout error:', error)
    return { success: false, error: 'Logout failed' }
  }
}

/**
 * Create a new admin user (only for super_admin)
 */
export async function createAdminUser(
  data: {
    email: string
    name: string
    password: string
    role?: 'admin' | 'super_admin'
  },
  createdBy: string
): Promise<{ success: boolean; error?: string; user?: AdminUser }> {
  try {
    // Hash password
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(data.password, salt)

    // Create admin user
    const { data: newAdmin, error } = await supabaseAdmin
      .from('admin_users')
      .insert({
        email: data.email,
        name: data.name,
        password_hash: passwordHash,
        role: data.role || 'admin',
        created_by: createdBy
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') { // Unique violation
        return { success: false, error: 'Email already exists' }
      }
      return { success: false, error: 'Failed to create admin user' }
    }

    const { password_hash, ...userWithoutPassword } = newAdmin

    return {
      success: true,
      user: userWithoutPassword as AdminUser
    }
  } catch (error) {
    console.error('Create admin user error:', error)
    return { success: false, error: 'Failed to create admin user' }
  }
}

/**
 * Update admin user password
 */
export async function updateAdminPassword(
  adminId: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(newPassword, salt)

    const { error } = await supabaseAdmin
      .from('admin_users')
      .update({ password_hash: passwordHash })
      .eq('id', adminId)

    if (error) {
      return { success: false, error: 'Failed to update password' }
    }

    return { success: true }
  } catch (error) {
    console.error('Update admin password error:', error)
    return { success: false, error: 'Failed to update password' }
  }
}

/**
 * List all admin users
 */
export async function listAdminUsers(): Promise<{ success: boolean; users?: AdminUser[]; error?: string }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .select('id, email, name, role, is_active, last_login, created_at, updated_at')
      .order('created_at', { ascending: false })

    if (error) {
      return { success: false, error: 'Failed to fetch admin users' }
    }

    return {
      success: true,
      users: data as AdminUser[]
    }
  } catch (error) {
    console.error('List admin users error:', error)
    return { success: false, error: 'Failed to fetch admin users' }
  }
}

/**
 * Update admin user status
 */
export async function updateAdminUserStatus(
  adminId: string,
  isActive: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabaseAdmin
      .from('admin_users')
      .update({ is_active: isActive })
      .eq('id', adminId)

    if (error) {
      return { success: false, error: 'Failed to update admin status' }
    }

    // If deactivating, remove all sessions
    if (!isActive) {
      await supabaseAdmin
        .from('admin_sessions')
        .delete()
        .eq('admin_user_id', adminId)
    }

    return { success: true }
  } catch (error) {
    console.error('Update admin status error:', error)
    return { success: false, error: 'Failed to update admin status' }
  }
}

/**
 * Delete admin user
 */
export async function deleteAdminUser(adminId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabaseAdmin
      .from('admin_users')
      .delete()
      .eq('id', adminId)

    if (error) {
      return { success: false, error: 'Failed to delete admin user' }
    }

    return { success: true }
  } catch (error) {
    console.error('Delete admin user error:', error)
    return { success: false, error: 'Failed to delete admin user' }
  }
}
