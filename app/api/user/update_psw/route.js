import { NextResponse } from 'next/server';
import { getRequestContext } from "@cloudflare/next-on-pages"
import { execute_query } from "@/db/sql_func";
import { hashPassword } from '@/app/utils/general';

export async function POST(request) {

    const { oldPassword, newPassword, user_id } = await request.json();
    
    const oldPasswordHash = await hashPassword(oldPassword);

    const querySearchUserPasswordMatch = 
    `
        SELECT *
        FROM Users
        WHERE password = ? AND user_id = ?;
    `;

    let db_response
    const DB = getRequestContext().env.DB;
    
    try{
        db_response = await execute_query(DB, querySearchUserPasswordMatch, oldPasswordHash, user_id);
        console.log(db_response);
        
        
        
        if(db_response.results.length == 0){
            return NextResponse.json({ message: 'La contraseña actual no coincide con la registrada', success: false }, { status: 404 });
        }else if(db_response.results.length == 1){
            const queryUpdatePassword = 
            `
                UPDATE Users
                SET password = ?, updated_at = datetime('now')
                WHERE user_id = ?
            `;
            const newPasswordHash = await hashPassword(newPassword);
            console.log(oldPasswordHash,newPasswordHash);
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