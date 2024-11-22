import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from '@/lib/r2'
import { NextResponse } from 'next/server';

export const config = {
    api: {
      bodyParser: false,
    },
  };

export async function POST(request) {
    
    const form = await request.formData()
    const file = form.get('file');
    const user_id = form.get('user_id');
    
    if (!file) {
        return NextResponse.json({ message: 'No se proporcionó ningún archivo', success: false }, { status: 400 });
    }
    
    //const fileName = file.name;
    const fileName = 'pfp_'+user_id+'.png'
    const fileType = file.type;
    const fileSize = file.size;

    console.log(fileName, fileType, fileSize,'pfp_'+user_id+'.png');

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];

    if (!allowedTypes.includes(fileType)) {
        return NextResponse.json({ message: 'Tipo de archivo no permitido. Solo se permiten imágenes.', success: false }, { status: 400 });
    }
    
    try {
        const signedUrl = await getSignedUrl(
            r2,
            new PutObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME,
                Key: fileName,
                ContentType: fileType,
                ContentLength: fileSize
            }),
            { expiresIn: 60 }
        );
    
        return NextResponse.json({ url: signedUrl });
    } catch (err) {
        console.log('error', err);
        return NextResponse.json({ message: 'Error al generar la URL firmada', success: false }, { status: 500 });
    }
}


export const runtime = 'edge'
