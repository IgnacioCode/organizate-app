import { NextResponse } from 'next/server';
import { getRequestContext } from "@cloudflare/next-on-pages"
import { cookies } from 'next/headers'
import { execute_query, beginTrx, commitTrx, rollbackTrx, } from '@/db/sql_func';

export async function POST(request) {

    const { plan_id, invite_key } = await request.json();
    const cookieStore = cookies();

    const DB = getRequestContext().env.DB;

    let db_response
    try {

        const queryPlanDelete = `
            DELETE FROM Plans
            WHERE plan_id=? AND invite_key=?
        `;

        db_response = await DB.batch([
            DB.prepare(queryPlanDelete).bind(plan_id,invite_key),
        ])

    }
    catch (e) {
        console.log(e);
    }

    console.log(db_response);

    let response = null;

    if (db_response[0].success) {
        response = NextResponse.json({ message: 'Plan creado exitosamente', success: true, plan_id: db_response[0].last_row_id }, { status: 201 });
    }
    else {
        response = NextResponse.json({ message: 'No se pudo crear el Plan', success: false }, { status: 404 });
    }

    return response;
}

export const runtime = 'edge'
