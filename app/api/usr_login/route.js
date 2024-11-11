import { NextResponse } from 'next/server';
import {getRequestContext} from "@cloudflare/next-on-pages"
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export function hashPassword(plainInput) { // Número de iteraciones del algoritmo, a mayor número, mayor seguridad y costo computacional
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(plainInput, salt);
}

export function verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compareSync(plainPassword, hashedPassword);
}

const SECRET_KEY = process.env.JWT_SEED_KEY;

export async function POST(request) {
    const { email, password } = await request.json();

    
    let response = await fetch(process.env.DEPLOY_IP + '/api/check_cred', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-server-flag':"InternalRequest"
        },
        body: JSON.stringify({ email, password }),
      });
    const data = await response.json();
    console.log("API --->");
    
    console.log(data);

    if(data.success!=false){
        const authToken = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
        response = NextResponse.json({ message: 'Inicio de sesion exitoso', success:true }, { status: 200 });
        response.headers.set('Set-Cookie', `authToken=${authToken}; Path=/; HttpOnly; SameSite=Strict`);
    }
    else{
        response = NextResponse.json({ message: 'Credenciales incorrectas', success:false }, { status: 404 });
    }
    

    return response
}
