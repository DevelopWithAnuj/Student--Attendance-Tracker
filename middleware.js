import { NextResponse } from 'next/server';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
 
export async function middleware(request) {
  const { isAuthenticated } = getKindeServerSession(request);

  const protectedRoutes = ['/dashboard', '/dashboard/settings', '/dashboard/students', '/dashboard/attendance'];

  const currentPath = request.nextUrl.pathname;

  if (protectedRoutes.includes(currentPath) ) {
      const loggedIn = await isAuthenticated();
      if (!loggedIn) {
          return NextResponse.redirect(new URL("/api/auth/login", request.url));
      }
  }
  return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*']
};
