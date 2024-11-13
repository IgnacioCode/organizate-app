import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { hashPassword } from '@/app/utils/general';

const SECRET_KEY = process.env.JWT_SEED_KEY;

export async function POST(request) {
    const { email, password } = await request.json();
    
    const hash_password = await hashPassword(password);

    let response = await fetch(process.env.DEPLOY_IP + '/api/check_cred', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-server-flag':"InternalRequest"
        },
        body: JSON.stringify({ email, password:hash_password }),
      });
    const data = await response.json();

    if(data.success!=false){
        let user_id = data.users[0].user_id;
        const authToken = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
        response = NextResponse.json({ message: 'Inicio de sesion exitoso', success:true ,user_id:user_id}, { status: 200 });
        response.headers.set('Set-Cookie', `authToken=${authToken}; Path=/; HttpOnly; SameSite=Strict`);
        response.headers.append('Set-Cookie', `userEmail=${email}; Path=/; HttpOnly; SameSite=Strict`);
    }
    else{
        response = NextResponse.json({ message: 'Credenciales incorrectas', success:false }, { status: 404 });
    }
    
    return response
}
