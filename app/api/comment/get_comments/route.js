import { NextResponse } from 'next/server';
import { getRequestContext } from "@cloudflare/next-on-pages"


export async function GET(request) {

    const url = new URL(request.url)
    const params = url.searchParams
    const plan_id = params.get("plan_id")
    let response = null;
    console.log(plan_id);
    

    const query = "SELECT * FROM Comments WHERE plan_id=?;";
    //
    const DB = getRequestContext().env.DB;
    let db_response = await DB.prepare(query).bind(plan_id).run();
    //let db_response = await DB.prepare(query).run();
    if (db_response.success) {
        response = NextResponse.json({ message: 'Comentarios encontrados exitosamente', success: true, comments:db_response.results }, { status: 201 });
    }
    else {
        response = NextResponse.json({ message: 'No se pudo encontrar los comentarios', success: false }, { status: 404 });
    }
    return response;
}

export const runtime = 'edge'
