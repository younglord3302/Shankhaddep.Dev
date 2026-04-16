import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { contactApi } from "@/lib/insforge";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = contactSchema.parse(body);

    console.log("Contact form submission:", {
      name: validated.name,
      email: validated.email,
    });

    // Save to database
    try {
      await contactApi.submit({
        name: validated.name,
        email: validated.email,
        message: validated.message,
      });
      console.log("Saved contact submission to database");
    } catch (dbError) {
      console.error("Database save error:", dbError);
    }

    // Send email directly via Resend API
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Portfolio <onboarding@resend.dev>",
        to: ["shankhadeepmondal7@gmail.com"],
        subject: `New Contact Form Message from ${validated.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">New Contact Form Submission</h2>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>From:</strong> ${validated.name}</p>
              <p><strong>Email:</strong> <a href="mailto:${validated.email}">${validated.email}</a></p>
              <p><strong>Message:</strong></p>
              <p style="background: white; padding: 15px; border-radius: 4px;">${validated.message.replace(/\n/g, "<br>")}</p>
            </div>
            <p style="color: #888; font-size: 12px;">Submitted via Portfolio Contact Form</p>
          </div>
        `,
        reply_to: validated.email,
      }),
    });

    if (!resendResponse.ok) {
      const error = await resendResponse.json();
      console.error("Resend API error:", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 },
      );
    }

    const resendData = await resendResponse.json();
    console.log("Email sent:", resendData.id);

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 },
      );
    }

    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const { createClient } = await import("@insforge/sdk");
    const client = createClient({
      baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
      anonKey: process.env.NEXT_PUBLIC_INSFORGE_API_KEY || process.env.INSFORGE_API_KEY!,
    });

    const { error } = await client.database
      .from("contacts")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete contact error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

