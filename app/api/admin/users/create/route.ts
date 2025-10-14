import { NextRequest, NextResponse } from 'next/server'
import { createAdminUser, verifyAdminSession } from '@/lib/admin-auth'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    // Verify admin session
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('admin_session')?.value

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const sessionResult = await verifyAdminSession(sessionToken)

    if (!sessionResult.success || sessionResult.user?.role !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Super admin only' },
        { status: 403 }
      )
    }

    // Get request body
    const { email, name, password, role } = await request.json()

    if (!email || !name || !password) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create admin user
    const result = await createAdminUser(
      { email, name, password, role },
      sessionResult.user.id
    )

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      user: result.user
    })
  } catch (error) {
    console.error('Create admin user error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
