import fetch from 'node-fetch';
import 'dotenv/config';

const { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_API_KEY } = process.env;

async function main() {
  try {
    // Mocked data – replace with actual payload
    const email = 'amnewsworld1@proton.me';

    const response = await fetch(`${APPWRITE_ENDPOINT}/v1/functions`, {
      method: 'POST',
      headers: {
        'X-Appwrite-Project': APPWRITE_PROJECT_ID!,
        'X-Appwrite-Key': APPWRITE_API_KEY!,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        subject: "Welcome to Amniva!",
        content: "Thank you for joining us. Explore and enjoy our platform!",
        to: email
      })
    });

    if (!response.ok) throw new Error(`Failed: ${response.statusText}`);
    console.log("Welcome email sent successfully.");
  } catch (error) {
    console.error("Welcome email failed:", error);
  }
}

main();
