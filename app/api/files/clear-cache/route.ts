import { NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getR2Config } from '@/app/lib/getConfig';

export async function POST() {
  try {
    const config = await getR2Config();
    const s3Client = new S3Client(config);
    
    const command = new ListObjectsV2Command({
      Bucket: config.bucket,
    });
    await s3Client.send(command);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error clearing cache:', error);
    return NextResponse.json({ error: 'Failed to clear cache' }, { status: 500 });
  }
}