import { createServerFn } from "@tanstack/react-start";
import { Resend } from "resend";
import { z } from "zod";
import data from "@/data/portfolio.json";
import { ContactEmailTemplate } from "./email-template";
import React from "react";

const resend = new Resend(process.env["RESEND_API_KEY"]);

export const sendContactEmail = createServerFn({ method: "POST" })
  .validator(
    z.object({
      name: z.string().min(2, "Name is too short"),
      email: z.string().email("Invalid email address"),
      message: z.string().min(1, "Message must be at least 1 characters"),
    })
  )
  .handler(async ({ data: input }) => {
    try {
      const { data: emailData, error } = await resend.emails.send({
        // onboarding@resend.dev is the default testing domain for Resend.
        // It can only send to the email address registered with the Resend account.
        from: "Portfolio Contact Form <onboarding@resend.dev>",
        to: [data.profile.sendToEmail],
        subject: `New message from ${input.name}`,
        react: React.createElement(ContactEmailTemplate, input),
        replyTo: input.email,
      });

      if (error) {
        console.error("Resend error:", error);
        throw new Error(error.message);
      }

      return { success: true, id: emailData?.id };
    } catch (error) {
      console.error("Failed to send email:", error);
      throw new Error("Failed to send email");
    }
  });
