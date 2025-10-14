import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/admin-auth'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('admin_session')?.value

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: 'No session found' },
        { status: 401 }
      )
    }

    const result = await verifyAdminSession(sessionToken)

    if (!result.success) {
      // Clear invalid session cookie
      cookieStore.delete('admin_session')
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      user: result.user
    })
  } catch (error) {
    console.error('Admin session verification error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
