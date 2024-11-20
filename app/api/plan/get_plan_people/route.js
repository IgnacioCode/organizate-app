import { NextResponse } from 'next/server';
import { getRequestContext } from "@cloudflare/next-on-pages"
import { execute_query } from '@/db/sql_func';

export async function GET(request) {

    const url = new URL(request.url)
    const params = url.searchParams
    const plan_id = params.get("plan_id")

    const DB = getRequestContext().env.DB;

    let db_response
    try {

        const query = `
            SELECT u.user_id, u.username
            FROM PlansJoined pj
            JOIN Users u
            ON pj.user_id = u.user_id
            WHERE pj.plan_id=?
        `;

        db_response = await execute_query(DB, query, plan_id);

    }
    catch (e) {
        console.log(e);
    }

    console.log(db_response);
    
    let response = null;

    if (db_response.success) {
        response = NextResponse.json({ message: 'Invitados obtenidos exitosamente', success: true, guests:db_response.results }, { status: 201 });
    }
    else {
        response = NextResponse.json({ message: 'No se pudo obtener la lista de invitados para el plan', success: false }, { status: 404 });
    }

    return response;
}

export const runtime = 'edge'
