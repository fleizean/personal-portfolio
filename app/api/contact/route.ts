import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    const { name, email, subject, message } = await request.json();

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS, // App password
        },
    });

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: 'nsyagz@gmail.com',
            subject: `Contact Form: ${subject}`,
            html: `
                <h3>Yeni mesaj</h3>
                <p><strong>Ad:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Konu:</strong> ${subject}</p>
                <p><strong>Mesaj:</strong> ${message}</p>
            `,
        });

        return Response.json({ success: true });
    } catch (error) {
        return Response.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
}
