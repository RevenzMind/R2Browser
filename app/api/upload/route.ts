import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getR2Config } from '@/app/lib/getConfig';

export async function POST(request: Request) {
  try {
    const config = await getR2Config();  // Add await here
    const s3Client = new S3Client(config);
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const command = new PutObjectCommand({
      Bucket: config.bucket,
      Key: file.name,
      Body: Buffer.from(buffer),
      ContentType: file.type,
    });

    await s3Client.send(command);
    
    // Generate a signed URL for the uploaded file
    const getCommand = new GetObjectCommand({
      Bucket: config.bucket,
      Key: file.name,
    });
    const url = await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 });

    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '2gb', // Set your desired limit here
    },
  },
};
