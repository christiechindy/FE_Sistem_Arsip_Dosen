import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const accessToken = req.cookies.get("access_token");
    // const role = Number(req.cookies.get("role"));

    if (accessToken !== undefined) {
        return NextResponse.next();
    } else {
        // if (role === 2) {
        //     if (req.nextUrl.pathname.startsWith("/data-lulusan")) {
        //         return NextResponse.redirect(new URL("/home", req.url));
        //     }
        // }
        return NextResponse.redirect(new URL("/login", req.url));
    }
}

export const config = {
    matcher: ['/((?!login|_next|favicon|assets|auth).*)',]
}