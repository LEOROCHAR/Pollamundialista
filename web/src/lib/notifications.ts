import webpush from "web-push";
import nodemailer from "nodemailer";

type WebPushSubscription = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
};

export async function sendTestPush(subscription: WebPushSubscription) {
  const publicKey = process.env.WEB_PUSH_PUBLIC_KEY;
  const privateKey = process.env.WEB_PUSH_PRIVATE_KEY;
  if (!publicKey || !privateKey) {
    throw new Error("WEB_PUSH_PUBLIC_KEY/WEB_PUSH_PRIVATE_KEY not configured");
  }

  webpush.setVapidDetails(
    process.env.NEXTAUTH_URL ?? "http://localhost:3000",
    publicKey,
    privateKey,
  );

  const payload = JSON.stringify({
    title: "PollaMundialista",
    body: "Notificación de prueba ✅",
  });

  await webpush.sendNotification(subscription as unknown as webpush.PushSubscription, payload);
}

export async function sendTestEmail(to: string) {
  const smtpUrl = process.env.SMTP_URL;
  const from = process.env.EMAIL_FROM;
  if (!smtpUrl || !from) {
    throw new Error("SMTP_URL/EMAIL_FROM not configured");
  }

  const transporter = nodemailer.createTransport(smtpUrl);
  await transporter.sendMail({
    from,
    to,
    subject: "PollaMundialista — email de prueba",
    text: "Este es un email de prueba. Aquí irían: cierre de predicciones, inicio de partido, actualización de puntos.",
  });
}

