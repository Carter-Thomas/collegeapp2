import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { description } = req.body;

    // Configure your email transporter (replace with your email service details)
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Or your email service
      auth: {
        user: 'your-email@gmail.com', // Your Gmail address
        pass: 'your-email-password', // Your Gmail password or an App Password
      },
    });

    const mailOptions = {
      from: 'your-email@gmail.com', // Your email address
      to: 'cartermatthewthomas@gmail.com', // Recipient's email address
      subject: 'Inaccurate Information Report',
      text: `A user has reported inaccurate information:\n\n${description}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Report submitted successfully.' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Failed to send email.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}