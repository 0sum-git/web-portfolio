import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { code } = await request.json();
    const adminCode = process.env.ADMIN_CODE;

    if (!code || code !== adminCode) {
      return NextResponse.json({ error: 'Invalid admin code' }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API /api/auth/admin POST error:', error);
    return NextResponse.json({ error: 'Authentication failed', details: String(error) }, { status: 500 });
  }
}