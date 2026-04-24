import nodemailer from "nodemailer";

let cachedTransporter = null;

const getTransporter = () => {
  if (cachedTransporter) return cachedTransporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error("SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.");
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
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

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
