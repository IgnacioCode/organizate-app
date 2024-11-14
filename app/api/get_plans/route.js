import { NextResponse } from 'next/server';
import { getRequestContext } from "@cloudflare/next-on-pages"
import { cookies } from 'next/headers'

async function get_user_id_by_email(email) {

    const query = "SELECT user_id FROM Users WHERE email=?";

    try {
        const DB = getRequestContext().env.DB;
        let db_response = await DB.prepare(query).bind(email).run();
        return db_response.results[0].user_id;
    }
    catch (e) {
        console.log(e);
        return undefined;
    }

}

async function get_plans_by_user_id(user_id) {

    const query = "SELECT * FROM Plans WHERE user_id=?";

    try {
        const DB = getRequestContext().env.DB;
        let db_response = await DB.prepare(query).bind(user_id).run();
        return db_response.results;
    }
    catch (e) {
        console.log(e);
        return undefined;
    }

}

export async function GET(request) {

    const url = new URL(request.url)
    const params = url.searchParams
    const email = params.get("email")

    const user_id = await get_user_id_by_email(email)
    
    let plans_list = await get_plans_by_user_id(user_id);
    
    let response = null;

    if (plans_list!=undefined) {
        response = NextResponse.json({ message: 'Lista de planes obtenida', success: true, plans: plans_list }, { status: 201 });
    }
    else {
        response = NextResponse.json({ message: 'No se pudo obtener la lista de planes', success: false }, { status: 404 });
    }
    
    return response;
}

export const runtime = 'edge'
