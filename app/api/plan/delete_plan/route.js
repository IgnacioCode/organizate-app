import { NextResponse } from 'next/server';
import { getRequestContext } from "@cloudflare/next-on-pages"
import { cookies } from 'next/headers'
import { execute_query, beginTrx, commitTrx, rollbackTrx, } from '@/db/sql_func';

async function get_user_id_by_email(DB, email) {

    const query = "SELECT user_id FROM Users WHERE email=?";

    try {
        const db_response = await execute_query(DB, query, email)
        return db_response.results[0].user_id;
    }
    catch (e) {
        console.log(e);
        return undefined;
    }

}

async function get_plan_max_plan_id(DB) {

    const query = "SELECT MAX(plan_id) AS plan_id FROM Plans";

    try {
        const db_response = await execute_query(DB, query)

        return db_response.results[0].plan_id;
    }
    catch (e) {
        console.log(e);
        return undefined;
    }

}

export async function POST(request) {

    const { name, description, date } = await request.json();
    const cookieStore = cookies();
    const email = cookieStore.get('userEmail');

    const DB = getRequestContext().env.DB;

    let db_response
    try {
        const user_id = await get_user_id_by_email(DB, email.value)

        const queryPlanDelete = `
            DELETE FROM Plans
            WHERE plan_id=?
        `;


        const queryJoinedPlansDelete = `
            DELETE FROM PlansJoined
            WHERE user_id = ? AND plan_id = ?
        `;

        db_response = await DB.batch([
            DB.prepare(queryPlanDelete).bind(user_id, name, description, date),
            DB.prepare(queryJoinedPlansDelete).bind(user_id, await get_plan_max_plan_id(DB) + 1)
        ])

    }
    catch (e) {
        console.log(e);
    }

    console.log(db_response);

    let response = null;

    if (db_response[1].success) {
        response = NextResponse.json({ message: 'Plan creado exitosamente', success: true, plan_id: db_response[0].last_row_id }, { status: 201 });
    }
    else {
        response = NextResponse.json({ message: 'No se pudo crear el Plan', success: false }, { status: 404 });
    }

    return response;
}

export const runtime = 'edge'
