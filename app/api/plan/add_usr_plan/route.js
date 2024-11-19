import { NextResponse } from 'next/server';
import { getRequestContext } from "@cloudflare/next-on-pages"
import { cookies } from 'next/headers'
import { execute_query } from '@/db/sql_func';
import { get_user_id_by_email, get_plan_id_by_invitation_key } from '@/db/sql_func';


export async function POST(request) {

    const { invitation_key } = await request.json();
    const cookieStore = cookies();
    const email = cookieStore.get('userEmail');

    const DB = getRequestContext().env.DB;
    const plan_id = await get_plan_id_by_invitation_key(invitation_key);

    console.log(email.value, invitation_key, plan_id);
    

    let db_response
    try {
        const user_id = await get_user_id_by_email(email.value)

        const queryUsersPlansInsert = `
            INSERT INTO PlansJoined 
            (user_id, plan_id) 
            VALUES (?, ?)
        `;

        db_response = await execute_query(DB, queryUsersPlansInsert, user_id, plan_id);

    }
    catch (e) {
        console.log(e);
    }

    console.log(db_response);
    
    let response = null;

    if (db_response.success) {
        response = NextResponse.json({ message: 'Usuario agregado a plan exitosamente', success: true, plan_id: db_response.last_row_id }, { status: 201 });
    }
    else {
        response = NextResponse.json({ message: 'No se pudo agregar al plan', success: false }, { status: 404 });
    }

    return response;
}

export const runtime = 'edge'
