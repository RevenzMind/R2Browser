import { S3Client } from '@aws-sdk/client-s3'

const getS3Client = () => {
  const config = localStorage.getItem('r2Config')
  if (!config) {
    throw new Error('R2 configuration not found')
  }

  const { region, endpoint, accessKeyId, secretAccessKey } = JSON.parse(config)
  
  return new S3Client({
    region,
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey
    }
  })
}

export const s3Client = getS3Client()