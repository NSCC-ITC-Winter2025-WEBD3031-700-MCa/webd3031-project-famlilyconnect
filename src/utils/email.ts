import sgMail from '@sendgrid/mail';

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
};

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const sendEmail = async (data: EmailPayload) => {
  const msg = {
    to: data.to,
    from: {
      email: process.env.EMAIL_FROM!, 
      name: "Family App Connect",
    },
    subject: data.subject,
    html: data.html,
    replyTo: data.replyTo || undefined,
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent");
  } catch (error) {
    console.error("SendGrid error:", error);
    if (error instanceof Error && (error as any).response) {
      console.error((error as any).response.body);
    }
    throw new Error("Failed to send email");
  }
};
