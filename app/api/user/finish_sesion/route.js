import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Invalidar la cookie de sesión
    const response = NextResponse.json({ success: true });
    response.headers.set('Set-Cookie', `authToken=; Path=/; HttpOnly; SameSite=Strict`);
    response.headers.append('Set-Cookie', `userEmail=; Path=/; HttpOnly; SameSite=Strict`);
    return response;
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
