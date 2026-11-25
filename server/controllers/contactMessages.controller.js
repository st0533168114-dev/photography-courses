import contactMessages from "../models/contactMessage.js";

const ContactMessagesController = {
  get: async (req, res) => {
    try {
      const contactMessageList = await contactMessages.find({}).sort({ createdAt: -1 });
      res.status(200).json(contactMessageList);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getCount: async (req, res) => {
    try {
      const count = await contactMessages.countDocuments({ isHandled: false });
      res.status(200).json({ count });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  post: async (req, res) => {
    const { firstName, lastName, phone, email, message } = req.body;
    if (!firstName || !lastName || !phone || !email) {
      return res.status(400).json({ message: "יש למלא שם פרטי, שם משפחה, טלפון ואימייל" });
    }
    try {
      const newContactMessage = new contactMessages({
        firstName,
        lastName,
        phone,
        email,
        message,
      });
      await newContactMessage.save();
      res.status(201).json(newContactMessage);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  changeStatus: async (req, res) => {
    const { id } = req.params;
    const { isHandled } = req.body;
    if (typeof isHandled !== "boolean") {
      return res.status(400).json({ message: "יש לציין אם הפנייה טופלה" });
    }
    try {
      const updatedContactMessage = await contactMessages.findByIdAndUpdate(
        id,
        { isHandled },
        { returnDocument: "after", runValidators: true }
      );
      if (!updatedContactMessage) {
        return res.status(404).json({ message: "הפנייה לא נמצאה" });
      }
      res.status(200).json(updatedContactMessage);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;
    try {
      const deletedContactMessage = await contactMessages.findByIdAndDelete(id);
      if (!deletedContactMessage) {
        return res.status(404).json({ message: "הפנייה לא נמצאה" });
      }
      res.status(200).json(deletedContactMessage);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default ContactMessagesController;
