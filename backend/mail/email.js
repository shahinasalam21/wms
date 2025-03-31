import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); 


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

export const sendTaskNotification = async (email, workflowName, taskName, taskDesc, dueDate) => {
  try {
    const formattedDueDate = dueDate ? dueDate : "Not specified"; 

    const mailOptions = {
      from: process.env.EMAIL_USER, 
      subject: `New Task Assigned: ${taskName}`,
      html: `
        <h3>You have been assigned a new task in the workflow: <strong>${workflowName}</strong></h3>
        <p><strong>Task:</strong> ${taskName}</p>
        <p><strong>Description:</strong> ${taskDesc || "No description provided."}</p>
        <p><strong>Due Date:</strong> ${formattedDueDate}</p>
        <p>Please check your dashboard for more details.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${email} for task: ${taskName}`);
  } catch (error) {
    console.error(" Error sending email:", error);
  }
};
