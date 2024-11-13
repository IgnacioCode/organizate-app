import { NextResponse } from 'next/server';
import { getRequestContext } from "@cloudflare/next-on-pages"
import { cookies } from 'next/headers'

async function get_user_id_by_email(email) {

    const query = "SELECT user_id FROM Users WHERE email=?";

    console.log(email);
    try {
        const DB = getRequestContext().env.DB;
        let db_response = await DB.prepare(query).bind(email).run();
        console.log(db_response.results[0].user_id);
        return db_response.results[0].user_id;
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
    console.log(name, description, date, email.value);

    const user_id = await get_user_id_by_email(email.value)
    console.log(user_id,"");
    
    const query = "INSERT INTO Plans (user_id, name, description, date) VALUES (?, ?, ?, ?)";

    const DB = getRequestContext().env.DB;
    let db_response = await DB.prepare(query).bind(user_id, name, description, date).run();
    console.log(db_response);
    let response = null;
    
    if (db_response.success) {
        response = NextResponse.json({ message: 'Usuario creado exitosamente', success: true, users: db_response.results }, { status: 201 });
    }
    else {
        response = NextResponse.json({ message: 'No se pudo crear al usuario', success: false }, { status: 404 });
    }
    
    return response;
}

export const runtime = 'edge'
