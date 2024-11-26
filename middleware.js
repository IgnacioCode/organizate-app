import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { useSearchParams } from 'next/navigation'
import { execute_query } from './db/sql_func';

export default async function middleware(req) {

    const authToken = req.cookies.get('authToken');
    const REQ_PATH = req.nextUrl.pathname
    const SERVER_FLAG = req.headers.get('X-server-flag')

    const SECRET_KEY = process.env.JWT_SEED_KEY;

    if (SERVER_FLAG) {
        return NextResponse.next();
    }

    console.log(REQ_PATH);

    if (REQ_PATH == '/recover') {
        const searchParams = useSearchParams()
        const recoverToken = searchParams.get('token')

        const query = 'SELECT * FROM PasswordRecovery WHERE token = ?';
        try {
            const DB = getRequestContext().env.DB;
            const db_response = await execute_query(DB, query, recoverToken);

            if (db_response.results.length == 1) {
                return NextResponse.next();
            }
            else {
                return NextResponse.redirect(new URL('/error', req.url));
            }
        }
        catch (e) {
            console.log(e);
            return NextResponse.redirect(new URL('/error', req.url));
        }

    }

    try {
        await jwtVerify(authToken.value, new TextEncoder().encode(SECRET_KEY));
    } catch (error) {
        console.log("Error del middleware: " + error);
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next|static|api/usr_login|login|register|api/user/create_usr|api/check_cred|api/user/send_psw_rec|recover|api/user/recover_psw).*)'],
};