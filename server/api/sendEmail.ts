import nodemailer from "nodemailer";
export default defineEventHandler(async (event) => {
  console.log("sendEmail API CALLED");
  const body = await readBody(event);
  const transporter = nodemailer.createTransport({
    host: "smtp.mail.ru",
    port: 465,
    secure: true, // or 'STARTTLS'
    auth: {
      user: "order@belca.by",
      pass: "fdtwvd41j3uxM6mAs1ib",
    },
  });

  const mailOptions = {
    from: "order@belca.by",
    to: body.to,
    subject: body.subject,
    text: body.text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
});
