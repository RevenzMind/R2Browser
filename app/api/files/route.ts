import { NextResponse } from 'next/server'
import { S3Client, ListObjectsV2Command, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { getR2Config } from '@/app/lib/getConfig'

export async function GET() {
  try {
    const config = await getR2Config();
    const s3Client = new S3Client(config);
    
    const command = new ListObjectsV2Command({
      Bucket: config.bucket,
    });
    const response = await s3Client.send(command);
    
    if (response.Contents) {
      const filesWithUrls = await Promise.all(
        response.Contents.map(async (file) => {
          const url = await getSignedUrl(
            s3Client,
            new GetObjectCommand({
              Bucket: config.bucket,
              Key: file.Key
            }),
            { expiresIn: 3600 }
          );
          return { ...file, url };
        })
      );
      return NextResponse.json(filesWithUrls);
    }
    return NextResponse.json([]);
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const config = await getR2Config();
    const s3Client = new S3Client(config);
    
    const { key } = await request.json();
    const command = new DeleteObjectCommand({
      Bucket: config.bucket,
      Key: key
    });
    await s3Client.send(command);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}