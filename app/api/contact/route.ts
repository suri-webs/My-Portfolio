
import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { fullname, email, phone, subject, message } = await req.json();

        // Basic server-side validation
        if (!fullname || !email || !subject || !message) {
            return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
        }

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,       // e.g. "smtp.gmail.com"
            port: Number(process.env.SMTP_PORT) || 587,
            secure: false,                      // true for port 465, false for 587
            auth: {
                user: process.env.SMTP_USER,      // your email address
                pass: process.env.SMTP_PASS,      // app password / SMTP password
            },
        });

        await transporter.sendMail({
            from: `"Contact Form" <${process.env.SMTP_USER}>`,
            to: process.env.CONTACT_TO_EMAIL,  // where you want to receive messages
            replyTo: email,
            subject: `[Contact] ${subject} — from ${fullname}`,
            html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto">
          <h2 style="color:#6d28d9">New Contact Form Submission</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#64748b;width:120px"><b>Name</b></td><td>${fullname}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b"><b>Email</b></td><td><a href="mailto:${email}">${email}</a></td></tr>
            ${phone ? `<tr><td style="padding:8px 0;color:#64748b"><b>Phone</b></td><td>${phone}</td></tr>` : ""}
            <tr><td style="padding:8px 0;color:#64748b"><b>Subject</b></td><td>${subject}</td></tr>
          </table>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0"/>
          <p style="color:#334155;white-space:pre-wrap">${message}</p>
        </div>
      `,
        });

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("[contact/route] nodemailer error:", err);
        return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 });
    }
}