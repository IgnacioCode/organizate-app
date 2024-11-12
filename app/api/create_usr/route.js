import { NextResponse } from 'next/server';
import {getRequestContext} from "@cloudflare/next-on-pages"

async function hashPassword(password) {
    // Codifica la contraseña como un ArrayBuffer
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
  
    // Genera el hash utilizando el algoritmo SHA-256
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
    // Convierte el ArrayBuffer a una cadena hexadecimal
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  
    return hashHex;
  }

const SECRET_KEY=process.envJWT_SEED_KEY

export async function POST(request) {

    const { username, email, password } = await request.json();
    let response = null;
    console.log(username);
    

    const hash_password = await hashPassword(password,SECRET_KEY);
    
    const query = "INSERT INTO Users (username, email, password) VALUES (?, ?, ?)";

    const DB = getRequestContext().env.DB;
    let db_response = await DB.prepare(query).bind(username,email,hash_password).run();
    console.log(db_response);
    
    if(db_response.success){
        response = NextResponse.json({ message: 'Usuario creado exitosamente', success:true,users:db_response.results }, { status: 201 });
    }
    else{
        response = NextResponse.json({ message: 'No se pudo crear al usuario', success:false }, { status: 404 });
    }
    return response;
}

export const runtime = 'edge'
