import { cookies } from 'next/headers';

export async function getR2Config() {
  const cookieStore = await cookies();
  const config = cookieStore.get('r2Config');
  
  if (!config) {
    throw new Error('R2 configuration not found');
  }

  const { region, endpoint, accessKeyId, secretAccessKey, bucket } = JSON.parse(config.value);
  
  return {
    region,
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey
    },
    bucket
  };
}