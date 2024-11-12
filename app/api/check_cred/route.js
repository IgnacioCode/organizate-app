import { NextResponse } from 'next/server';
import {getRequestContext} from "@cloudflare/next-on-pages"

export async function POST(request) {

    const { email, password } = await request.json();
    let response = null;
    
    const DB = getRequestContext().env.DB;
    let db_response = await DB.prepare("SELECT * FROM Users WHERE email=? AND password=?").bind(email,password).run();
    
    if(db_response.results.length!=0){
        response = NextResponse.json({ message: 'Usuario encontrado', success:true,users:db_response.results }, { status: 202 });
    }
    else{
        response = NextResponse.json({ message: 'Usuario no encontrado', success:false }, { status: 404 });
    }
    return response;
}

export const runtime = 'edge'
