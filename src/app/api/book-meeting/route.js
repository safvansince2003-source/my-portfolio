
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { fullName, email, date, time, reason } =
      await request.json();

    // Validate required fields
    if (!fullName || !email || !date || !time || !reason) {
      return Response.json(
        { error: "Please fill in all fields." },
        { status: 400 }
      );
    }

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return Response.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Validate date
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return Response.json(
        { error: "Invalid meeting date." },
        { status: 400 }
      );
    }

    // Accept times like 14:30, 2:30 PM, or 02:30 AM
    const match = String(time).trim().match(
      /^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i
    );

    if (!match) {
      return Response.json(
        { error: "Invalid meeting time." },
        { status: 400 }
      );
    }

    let hours = Number(match[1]);
    const minutes = Number(match[2]);
    const period = match[3]?.toUpperCase();

    if (
      minutes > 59 ||
      (period && (hours < 1 || hours > 12)) ||
      (!period && hours > 23)
    ) {
      return Response.json(
        { error: "Invalid meeting time." },
        { status: 400 }
      );
    }

    if (period) {
      hours = hours % 12;
      if (period === "PM") hours += 12;
    }

    const [year, month, day] = date.split("-").map(Number);

    const meetingDate = new Date(
      year,
      month - 1,
      day,
      hours,
      minutes
    );

    // Reject invalid calendar dates and past meetings
    if (
      meetingDate.getFullYear() !== year ||
      meetingDate.getMonth() !== month - 1 ||
      meetingDate.getDate() !== day ||
      meetingDate <= new Date()
    ) {
      return Response.json(
        { error: "Please choose a valid future date and time." },
        { status: 400 }
      );
    }

    // Check Gmail configuration
    if (
      !process.env.GMAIL_USER ||
      !process.env.GMAIL_APP_PASSWORD ||
      !process.env.BOOKING_NOTIFICATION_EMAIL
    ) {
      console.error("Gmail environment variables are missing.");

      return Response.json(
        { error: "Email service is not configured." },
        { status: 500 }
      );
    }

    // Configure Nodemailer with Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Admin notification email
    const adminEmail = transporter.sendMail({
      from: `"Portfolio Booking" <${process.env.GMAIL_USER}>`,
      to: process.env.BOOKING_NOTIFICATION_EMAIL,
      replyTo: email,
      subject: `New meeting request from ${fullName}`,
      text: `
You have received a new meeting request!

Name: ${fullName}
Email: ${email}
Date: ${date}
Time: ${time}

Agenda:
${reason}
      `,
    });

    // Visitor confirmation email
    const visitorEmail = transporter.sendMail({
      from: `"Portfolio Booking" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Thank you for booking a meeting!",
      text: `
Hi ${fullName},

Thank you for requesting a meeting with me!

I have received your meeting request.

Your requested meeting details:

Date: ${date}
Time: ${time}

I will review your request and send you the meeting invitation or link soon.

Thank you,
Portfolio Owner
      `,
    });

    // Attempt to send both emails
    const results = await Promise.allSettled([
      adminEmail,
      visitorEmail,
    ]);

    const failedEmails = results.filter(
      (result) => result.status === "rejected"
    );

    if (failedEmails.length > 0) {
      console.error("Email sending failed:", failedEmails);

      return Response.json(
        {
          error:
            "Your booking was received, but one or more emails could not be sent. Please contact the site owner.",
        },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      message:
        "Your meeting request was sent successfully! A confirmation email is on its way.",
    });

  } catch (error) {
    console.error("Booking API error:", error);

    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
