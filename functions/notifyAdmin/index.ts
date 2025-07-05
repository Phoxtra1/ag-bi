import fetch from 'node-fetch';
import 'dotenv/config';

const { ADMIN_EMAIL, APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_API_KEY } = process.env;

async function main() {
  try {
    // Replace this with actual data passed to the function if needed
    const body = {
      message: "A new prediction or contact message has been submitted.",
    };

    const response = await fetch(`${APPWRITE_ENDPOINT}/v1/functions`, {
      method: 'POST',
      headers: {
        'X-Appwrite-Project': APPWRITE_PROJECT_ID!,
        'X-Appwrite-Key': APPWRITE_API_KEY!,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        subject: "New Notification",
        content: body.message,
        to: ADMIN_EMAIL
      })
    });

    if (!response.ok) throw new Error(`Failed: ${response.statusText}`);
    console.log("Admin notified successfully.");
  } catch (error) {
    console.error("Notification failed:", error);
  }
}

main();
