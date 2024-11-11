import { NextResponse } from 'next/server';
export default async function middleware(req) {

    const authToken = req.cookies.get('authToken');
    const REQ_PATH = req.nextUrl.pathname
    const SERVER_FLAG = req.headers.get('server-flag')

    if (SERVER_FLAG) {
        return NextResponse.next();
    }

    try {
        // Verificar el token JWT
        await jwtVerify(authToken.value, new TextEncoder().encode(SECRET_KEY));
    } catch (error) {
        // Si el token no es válido o ha expirado, redirigir al login
        console.log("Error del middleware: " + error);
        return NextResponse.redirect(new URL('/login', req.url));
        //return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next|static|api/usr_login|login).*)'],
};