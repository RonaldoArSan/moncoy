import { NextRequest, NextResponse } from 'next/server'
import { updateAdminUserStatus, verifyAdminSession } from '@/lib/admin-auth'
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
    const { adminId, isActive } = await request.json()

    if (!adminId || isActive === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Prevent disabling own account
    if (adminId === sessionResult.user.id) {
      return NextResponse.json(
        { success: false, error: 'Cannot disable own account' },
        { status: 400 }
      )
    }

    // Update status
    const result = await updateAdminUserStatus(adminId, isActive)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Toggle admin status error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
