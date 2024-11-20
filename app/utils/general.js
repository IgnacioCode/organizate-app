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

export function formatDate(dateString, format) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    const replacements = {
        'DD': day,
        'MM': month,
        'YYYY': year,
        'HH': hours,
        'mm': minutes,
        'ss': seconds
    };

    return format.replace(/DD|MM|YYYY|HH|mm|ss/g, match => replacements[match]);
}