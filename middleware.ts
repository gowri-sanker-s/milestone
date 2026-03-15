import NextAuth from "next-auth";
import { NextResponse } from "next/server";

// A dummy auth instance for edge compatibility to parse the session cookie
const { auth } = NextAuth({
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  providers: [],
});

const protectedPaths = [
  /^\/shipping-address/,
  /^\/payment-method/,
  /^\/place-order/,
  /^\/profile/,
  /^\/user\/(.*)/,
  /^\/order\/(.*)/,
  /^\/admin\/(.*)/,
];

export const middleware = auth((req: any) => {
  const { pathname } = req.nextUrl;
  
  // Check auth for protected routes
  const isProtected = protectedPaths.some((p) => p.test(pathname));

  if (isProtected && !req.auth) {
    const signInUrl = new URL('/sign-in', req.nextUrl);
    signInUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Handle sessionCartId cookie
  const sessionCartId = req.cookies.get("sessionCartId");
  let response = NextResponse.next();

  if (!sessionCartId) {
    // Generate new sessionCartId
    const newCartId = crypto.randomUUID();
    
    // We have to set the cookie on the response
    response.cookies.set("sessionCartId", newCartId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
  }

  return response;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
