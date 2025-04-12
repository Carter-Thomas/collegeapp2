import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { description } = await req.json();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'cartermatthewthomas@gmail.com', 
        pass: process.env.GMAIL_APP_PASSWORD 
      },
    });

    const mailOptions = {
      from: 'cartermatthew@gmail.com',
      to: 'cartermatthewthomas@gmail.com',
      subject: 'Inaccurate Information Report',
      text: `A user has reported inaccurate information:\n\n${description}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return NextResponse.json({ message: 'Report submitted successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ message: 'Failed to send email.' }, { status: 500 });
  }
}