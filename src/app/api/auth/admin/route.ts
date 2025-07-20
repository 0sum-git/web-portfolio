import { NextResponse } from 'next/server';
import { isValidAdminCode, setAdminAuthCookie, handleApiError } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code || !isValidAdminCode(code)) {
      return NextResponse.json({ error: 'Invalid admin code' }, { status: 401 });
    }

    // Set authentication cookie
    await setAdminAuthCookie(true);

    return NextResponse.json({ success: true });
  } catch (error) {
    const errorResponse = handleApiError(error, 'Authentication failed');
    return NextResponse.json(errorResponse, { status: 500 });
  }
}