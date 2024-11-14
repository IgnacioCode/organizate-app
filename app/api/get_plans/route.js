import { NextResponse } from 'next/server';
import { getRequestContext } from "@cloudflare/next-on-pages"
import { cookies } from 'next/headers'
import {get_user_id_by_email,get_plans_by_user_id} from '@/db/sql_func.js';

export async function GET(request) {

    const url = new URL(request.url)
    const params = url.searchParams
    const email = params.get("email")

    const user_id = await get_user_id_by_email(email)
    
    let plans_list = await get_plans_by_user_id(user_id);
    
    let response = null;

    if (plans_list!=undefined) {
        response = NextResponse.json({ message: 'Lista de planes obtenida', success: true, plans: plans_list }, { status: 201 });
    }
    else {
        response = NextResponse.json({ message: 'No se pudo obtener la lista de planes', success: false }, { status: 404 });
    }
    
    return response;
}

export const runtime = 'edge'
