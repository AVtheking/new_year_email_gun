require("dotenv").config();
const { Client } = require("pg");
const nodemailer = require("nodemailer");


const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASSWORD
} = process.env;

// Create a  PostgreSQL client
const client = new Client({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false, // Use TLS
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

// Connect to the database and send emails
async function sendNewYearEmails() {
  try {
    console.log("Connecting to the database...");
    await client.connect();
    console.log("Connected!");

   
    const query = "SELECT email FROM users WHERE subscribed = PRO or subscribed=BUISNESS;";
    console.log(`Executing query: ${query}`);
    const result = await client.query(query);


    const emails = result.rows.map(row => row.email);
    console.log(`Found ${emails.length} email addresses.`);

    for (const email of emails) {
      const message = {
        from: '"Traycer new year bot" <noreply@example.com>',
        to: email,
        subject: "🎉 Happy New Year! 🎉",
        text: "Wishing you a fantastic New Year ahead filled with joy and success! 🎊 from traycer , keep coding keep building",
      };

      await transporter.sendMail(message);
      console.log(`Sent New Year email to ${email}`);
    }

    console.log("All emails sent successfully!");
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    console.log("Closing database connection...");
    await client.end();
    console.log("Connection closed.");
  }
}

// Start the script
sendNewYearEmails();

