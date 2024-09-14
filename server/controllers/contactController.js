import { Contact } from "../models/contactModel.js";
import { sendEmail } from "../utils/features.js";

const contact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    await sendEmail({
      to: process.env.MY_GMAIL_ID,
      subject: `${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });

    await Contact.create({ name, email, subject, message });

    return res.status(200).json({
      success: true,
      message: "Contact form submitted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error in contact API" });
  }
};

export { contact };
