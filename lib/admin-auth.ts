import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export interface AdminUser {
  id: number;
  username: string;
  name: string;
  role: string;
}

export async function verifyAdminToken(request: NextRequest): Promise<AdminUser | null> {
  try {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return null;
    }

    const secret = new TextEncoder().encode(
      process.env.ADMIN_SECRET_KEY || 'default-secret-key-change-this'
    );

    const { payload } = await jwtVerify(token, secret);

    return {
      id: payload.id as number,
      username: payload.username as string,
      name: payload.name as string,
      role: payload.role as string,
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}
