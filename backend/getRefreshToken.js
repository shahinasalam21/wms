import { OAuth2Client } from "google-auth-library";
import readline from "readline";
import dotenv from "dotenv";

dotenv.config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "your-client-id";
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "your-client-secret";
const REDIRECT_URI = "http://localhost:5000/auth/callback"; 

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI); 

// Step 1: Generate Auth URL
const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: SCOPES,
});

console.log("🔹 Open this URL in your browser and authorize the app:");
console.log(authUrl);

// Step 2: Capture Auth Code from User
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("\n🔹 Paste the authorization code here: ", async (code) => {
  rl.close();

  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log("\n Successfully generated tokens:");
    console.log(tokens);

    console.log("\n🔹 Save this Refresh Token in your .env file:");
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
  } catch (error) {
    console.error(" Error generating refresh token:", error);
  }
});
