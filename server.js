const path = require("path");
const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || 465);
const smtpSecure = String(process.env.SMTP_SECURE || "true") === "true";
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

const canSendEmail = smtpHost && smtpUser && smtpPass;
const transporter = canSendEmail
  ? nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: { user: smtpUser, pass: smtpPass }
    })
  : null;

app.post("/api/click", async (req, res) => {
  const { button, timestamp } = req.body || {};

  if (!button) {
    return res.status(400).json({ ok: false, error: "Missing button" });
  }

  if (!transporter) {
    return res.status(500).json({ ok: false, error: "Email not configured" });
  }

  const mailTo = process.env.MAIL_TO || "Steevensongleil85@gmail.com";
  const fromName = process.env.MAIL_FROM_NAME || "Steeve";
  const fromEmail = process.env.MAIL_FROM_EMAIL || smtpUser;

  try {
    await transporter.sendMail({
      from: `${fromName} <${fromEmail}>`,
      to: mailTo,
      subject: "Bouton clique - Page Britanie",
      text: `Bouton clique: ${button}\nDate: ${timestamp || new Date().toISOString()}`
    });

    return res.json({ ok: true });
  } catch (error) {
    console.error("Email send failed", error);
    return res.status(500).json({ ok: false, error: "Email send failed" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});