import { NextRequest, NextResponse } from 'next/server'
import { listAdminUsers } from '@/lib/admin-auth'
import { verifyAdminSession } from '@/lib/admin-auth'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
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

    // List admin users
    const result = await listAdminUsers()

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      users: result.users
    })
  } catch (error) {
    console.error('List admin users error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
