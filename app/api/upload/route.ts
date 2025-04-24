import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getR2Config } from '@/app/lib/getConfig';

export async function POST(request: Request) {
  try {
    const config = getR2Config();
    const s3Client = new S3Client(config);
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const command = new PutObjectCommand({
      Bucket: (await config).bucket,
      Key: file.name,
      Body: Buffer.from(buffer),
      ContentType: file.type,
    });

    await s3Client.send(command);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}