import { NextResponse } from 'next/server';
import { getRequestContext } from "@cloudflare/next-on-pages"
import { hashPassword } from '@/app/utils/general';

export async function POST(request) {

    const { username, email, password } = await request.json();
    let response = null;
    console.log(username);


    const hash_password = await hashPassword(password);
    console.log(hash_password);
    

    const query = "INSERT INTO Users (username, email, password) VALUES (?, ?, ?)";

    const DB = getRequestContext().env.DB;
    let db_response = await DB.prepare(query).bind(username, email, hash_password).run();
    console.log(db_response);

    if (db_response.success) {
        response = NextResponse.json({ message: 'Usuario creado exitosamente', success: true, users: db_response.results }, { status: 201 });
    }
    else {
        response = NextResponse.json({ message: 'No se pudo crear al usuario', success: false }, { status: 404 });
    }
    return response;
}

export const runtime = 'edge'
