import { NextResponse } from 'next/server';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
 
// This function can be marked `async` if using `await` inside
export async function middleware(request) {
  const { isAuthenticated } = await getKindeServerSession(); // pseudo code, replace with your auth logic

  const protectedRoutes = ['/dashboard', '/dashboard/settings', '/dashboard/students', '/dashboard/attendance'];

  // Check if current path is protected
    const currentPath = request.nextUrl.pathname;

    if (protectedRoutes.includes(currentPath) ) {
        const loggedIn = await isAuthenticated();
        if (!loggedIn) {
            return NextResponse.redirect(new URL("/api/auth/login?post_login_redirect_url=/dashboard", request.url));
        }
    }
    return NextResponse.next();
}
// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/dashboard/:path*']
};
