import { NextResponse } from 'next/server';
import { getRequestContext } from "@cloudflare/next-on-pages"
import { execute_query } from "@/db/sql_func";

export async function POST(request) {

    const { newUsername, user_id } = await request.json();
    
    const query = 
    `
        UPDATE Users
        SET username = ?, updated_at = datetime('now')
        WHERE user_id = ?
    `;

    let db_response
    const DB = getRequestContext().env.DB;
    
    try{
        db_response = await execute_query(DB, query, newUsername, user_id);
    }
    catch(e){
        console.log(e);
        return NextResponse.json({ message: 'No se pudo actualizar el nombre de usuario', success: false }, { status: 404 });
    }

    console.log(db_response);

    let response;

    if (db_response.success) {
        response = NextResponse.json({ message: 'Nombre de usuario actualizado exitosamente', success: true }, { status: 201 });
    }
    else {
        response = NextResponse.json({ message: 'No se pudo actualizar al usuario', success: false }, { status: 404 });
    }
    return response;
}

export const runtime = 'edge'
