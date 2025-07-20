import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Checks if the provided code matches the admin code from environment variables
 * @param code The code to check
 * @returns True if the code is valid, false otherwise
 */
export function isValidAdminCode(code: string): boolean {
  const adminCode = process.env.ADMIN_CODE;
  return code === adminCode;
}

/**
 * Middleware to check if the request is authenticated as admin
 * @param request The Next.js request object
 * @returns NextResponse with error if not authenticated, null if authenticated
 */
export function isAdminAuthenticated(request: NextRequest): NextResponse | null {
  // In a production environment, we would use a more secure method like JWT
  // For now, we'll check for an admin cookie that would be set after successful login
  const adminCookie = request.cookies.get('admin_authenticated');
  
  if (!adminCookie || adminCookie.value !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  return null;
}

/**
 * Sets the admin authentication cookie
 * @param isAuthenticated Whether the user is authenticated
 * @returns Promise that resolves when the cookie operation is complete
 */
export async function setAdminAuthCookie(isAuthenticated: boolean): Promise<void> {
  const cookieStore = await cookies();
  
  if (isAuthenticated) {
    // Set a cookie that expires in 24 hours
    await cookieStore.set('admin_authenticated', 'true', { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/'
    });
  } else {
    // Remove the cookie
    await cookieStore.delete('admin_authenticated');
  }
}

/**
 * Utility function to handle API errors in a production-safe way
 * @param error The error object
 * @param message A user-friendly error message
 * @returns An object with error details
 */
export function handleApiError(error: unknown, message: string): { error: string, details?: string } {
  // Log the full error for debugging
  console.error(`API Error: ${message}`, error);
  
  // In production, don't return detailed error information
  if (process.env.NODE_ENV === 'production') {
    return { error: message };
  }
  
  // In development, include more details
  return { 
    error: message,
    details: error instanceof Error ? error.message : String(error)
  };
}