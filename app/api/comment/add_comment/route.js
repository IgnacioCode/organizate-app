import { NextResponse } from 'next/server';
import { getRequestContext } from "@cloudflare/next-on-pages"


export async function POST(request) {

    const { plan_id, user_id, content } = await request.json();
    let response = null;
    console.log({ plan_id, user_id, content });
    
    const query = "INSERT INTO Comments (plan_id, user_id, content) VALUES (?, ?, ?)";

    const DB = getRequestContext().env.DB;
    let db_response = await DB.prepare(query).bind(plan_id, user_id, content).run();
    console.log(db_response);
    
    if (db_response.success) {
        response = NextResponse.json({ message: 'Comentario creado exitosamente', success: true }, { status: 201 });
    }
    else {
        response = NextResponse.json({ message: 'No se pudo crear el comentario', success: false }, { status: 404 });
    }
    return response;
}

export const runtime = 'edge'
