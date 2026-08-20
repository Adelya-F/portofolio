import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validation";
import { jsonValidationError } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) return jsonValidationError(parsed.error);

  const { name, email, message } = parsed.data;
  const saved = await prisma.message.create({ data: { name, email, message } });

  const resendApiKey = process.env.RESEND_API_KEY;
  const contactEmail = process.env.CONTACT_EMAIL;

  if (resendApiKey && contactEmail) {
    try {
      const resend = new Resend(resendApiKey);
      await resend.emails.send({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: contactEmail,
        replyTo: email,
        subject: `New message from ${name}`,
        text: `${message}\n\n— ${name} (${email})`,
      });
    } catch (error) {
      // The message is already saved in the database — don't fail the
      // request just because the notification email couldn't be sent.
      console.error("Failed to send contact notification email:", error);
    }
  }

  return NextResponse.json({ id: saved.id }, { status: 201 });
}
