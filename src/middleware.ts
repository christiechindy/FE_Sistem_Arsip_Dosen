import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const accessToken = req.cookies.get("access_token");

    if (accessToken !== undefined) {
        return NextResponse.next();
    } else {
        return NextResponse.redirect(new URL("/login", req.url));
    }
}

export const config = {
    matcher: ['/((?!login|_next|favicon|assets|auth).*)',]
}