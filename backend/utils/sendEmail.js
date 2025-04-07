import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendTaskAssignedEmail = async (to, taskDetails) => {
  const mailOptions = {
    from: `"Workflow System" <${process.env.EMAIL_USER}>`,
    to,
    subject: `New Task Assigned: ${taskDetails.title}`,
    html: `
      <h3>Hello!</h3>
      <p>You have been assigned a new task.</p>
      <ul>
        <li><strong>Title:</strong> ${taskDetails.title}</li>
        <li><strong>Description:</strong> ${taskDetails.description || "N/A"}</li>
        <li><strong>Priority:</strong> ${taskDetails.priority}</li>
        <li><strong>Due Date:</strong> ${new Date(taskDetails.due_date).toLocaleDateString()}</li>
      </ul>
      <p>Please check your dashboard for more details.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
