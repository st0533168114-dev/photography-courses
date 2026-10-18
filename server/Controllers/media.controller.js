import { signUpload } from "../Services/media.service.js";

const MediaController = {
  sign: (req, res) => {
    try {
      const signature = signUpload(req.body.paramsToSign);
      if (!signature) {
        return res.status(400).json({ message: "פרמטרי העלאה לא מורשים" });
      }
      res.status(200).json({ signature });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
export default MediaController;
