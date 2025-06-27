import { Client } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT) // This will be 'https://nyc.cloud.appwrite.io/v1'
  .setProject(process.env.NEXT_PUBLIC_PROJECT_ID); // This will be 'amniva-ri03'

export default client;
