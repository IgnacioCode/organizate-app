export async function hashPassword(password) {
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