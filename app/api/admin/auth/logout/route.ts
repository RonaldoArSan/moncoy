import { NextRequest, NextResponse } from 'next/server'
import { logoutAdmin } from '@/lib/admin-auth'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('admin_session')?.value

    if (sessionToken) {
      await logoutAdmin(sessionToken)
      cookieStore.delete('admin_session')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin logout error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
