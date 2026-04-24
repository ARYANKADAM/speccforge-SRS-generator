import nodemailer from "nodemailer";

let cachedTransporter = null;

const pickEnv = (...keys) => {
  for (const key of keys) {
    const value = process.env[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return String(value).trim();
    }
  }
  return "";
};

const detectProviderConfig = (email) => {
  const domain = String(email || "").split("@")[1]?.toLowerCase();
  if (!domain) return null;

  if (domain === "gmail.com" || domain === "googlemail.com") {
    return { host: "smtp.gmail.com", port: 587 };
  }

  if (domain === "outlook.com" || domain === "hotmail.com" || domain === "live.com") {
    return { host: "smtp.office365.com", port: 587 };
  }

  if (domain === "yahoo.com" || domain === "yahoo.co.in" || domain === "ymail.com") {
    return { host: "smtp.mail.yahoo.com", port: 587 };
  }

  if (domain === "icloud.com" || domain === "me.com" || domain === "mac.com") {
    return { host: "smtp.mail.me.com", port: 587 };
  }

  return null;
};

const getTransporter = () => {
  if (cachedTransporter) return cachedTransporter;

  const user = pickEnv("SMTP_USER", "MAIL_USER", "EMAIL_USER");
  const pass = pickEnv("SMTP_PASS", "MAIL_PASS", "EMAIL_PASS");
  const directHost = pickEnv("SMTP_HOST", "MAIL_HOST", "EMAIL_HOST");
  const directPort = pickEnv("SMTP_PORT", "MAIL_PORT", "EMAIL_PORT");
  const provider = detectProviderConfig(user);

  const host = directHost || provider?.host || "";
  const port = Number(directPort || provider?.port || 587);

  if (!host || !user || !pass) {
    throw new Error(
      "SMTP is not configured. Set SMTP_USER and SMTP_PASS, plus SMTP_HOST/SMTP_PORT (or use MAIL_* / EMAIL_* aliases)."
    );
  }

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  return cachedTransporter;
};

export const sendCollaborationInviteEmail = async ({ to, ownerName, projectName, inviteUrl }) => {
  const transporter = getTransporter();
  const from = pickEnv("SMTP_FROM", "MAIL_FROM", "EMAIL_FROM", "SMTP_USER", "MAIL_USER", "EMAIL_USER");

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0f172a;">
      <h2 style="margin-bottom: 8px;">SpecForge Collaboration Invite</h2>
      <p style="margin: 0 0 16px; color: #334155;">
        ${ownerName} invited you to collaborate on <strong>${projectName}</strong>.
      </p>
      <a href="${inviteUrl}" style="display: inline-block; padding: 10px 16px; background: #06b6d4; color: #082f49; font-weight: 700; border-radius: 8px; text-decoration: none;">
        Accept Invite
      </a>
      <p style="margin-top: 16px; font-size: 12px; color: #475569;">
        This link expires in 7 days. Sign in with the same email address this invite was sent to.
      </p>
      <p style="margin-top: 8px; font-size: 11px; color: #64748b; word-break: break-all;">
        ${inviteUrl}
      </p>
    </div>
  `;

  await transporter.sendMail({
    from,
    to,
    subject: `Invite: Edit \"${projectName}\" in SpecForge`,
    html,
    text: `${ownerName} invited you to collaborate on ${projectName}. Open this link to accept: ${inviteUrl}`,
  });
};
