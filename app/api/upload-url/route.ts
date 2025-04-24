import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getR2Config } from '@/app/lib/getConfig';

export async function POST(request: Request) {
  try {
    const config = getR2Config();
    const s3Client = new S3Client(config);
    
    const { filename, contentType } = await request.json();

    const command = new PutObjectCommand({
      Bucket: (await config).bucket,
      Key: filename,
      ContentType: contentType,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}