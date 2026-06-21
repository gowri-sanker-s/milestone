"use server";

import { prisma } from "@/lib/prisma";
import z from "zod";
import { insertContactMessageSchema } from "../validators";
import { formatErrors } from "../utils";
import { sendContactFormEmail } from "@/lib/resend";

export async function createContactMessage(data: z.infer<typeof insertContactMessageSchema>) {
  try {
    // Validate the fields against the Zod schema
    const parsed = insertContactMessageSchema.parse(data);

    // Save submission to database
    const newMessage = await prisma.contactMessage.create({
      data: {
        name: parsed.name.trim(),
        email: parsed.email.trim(),
        phone: parsed.phone ? parsed.phone.trim() : null,
        reason: parsed.reason,
        description: parsed.description.trim(),
        bookName: parsed.bookName ? parsed.bookName.trim() : null,
        author: parsed.author ? parsed.author.trim() : null,
      },
    });

    // Trigger contact form emails (non-blocking)
    try {
      await sendContactFormEmail(newMessage.id);
    } catch (emailError) {
      console.error("Failed to send contact form email:", emailError);
    }

    return {
      success: true,
      message: "Thank you! Your message has been sent successfully.",
    };
  } catch (error) {
    console.error("createContactMessage error:", error);
    return {
      success: false,
      message: formatErrors(error),
    };
  }
}
