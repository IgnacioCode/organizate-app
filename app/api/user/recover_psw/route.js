import { NextResponse } from 'next/server';
import { getRequestContext } from "@cloudflare/next-on-pages"
import { execute_query } from "@/db/sql_func";
import { hashPassword } from '@/app/utils/general';

export async function POST(request) {

    const { token, newPassword } = await request.json();

    const querySearchUserPasswordMatch = 
    `
        SELECT user_id
        FROM RecoverPassword
        WHERE token = ?;
    `;

    let db_response
    const DB = getRequestContext().env.DB;
    
    try{
        db_response = await execute_query(DB, querySearchUserPasswordMatch, token);
        console.log(db_response);
        
        if(db_response.results.length == 0){
            return NextResponse.json({ message: 'Error al intentar recuperar la contraseña', success: false }, { status: 404 });
        }else if(db_response.results.length == 1){
            const user_id = db_response.results[0].user_id;
            const queryUpdatePassword = 
            `
                UPDATE Users
                SET password = ?, updated_at = datetime('now')
                WHERE user_id = ?
            `;
            const newPasswordHash = await hashPassword(newPassword);
            db_response = await execute_query(DB, queryUpdatePassword, newPasswordHash, user_id);
        }
    }
    catch(e){
        console.log(e);
        return NextResponse.json({ message: 'La contraseña actual no coincide con la registrada', success: false }, { status: 404 });
    }

    console.log(db_response);

    let response;

    if (db_response.success) {
        response = NextResponse.json({ message: 'Contraseña actualizada exitosamente', success: true }, { status: 201 });
    }
    else {
        return NextResponse.json({ message: 'La contraseña actual no coincide con la registrada', success: false }, { status: 404 });
    }
    return response;
}

export const runtime = 'edge'
