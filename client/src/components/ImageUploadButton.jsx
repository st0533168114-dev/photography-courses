import { useEffect, useRef } from "react";
import { getUploadSignature } from "../API/mediaApi";
import styles from "../CSS/components/ImageUploadButton.module.css";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY;
const UPLOAD_PRESET = "site_images";

export default function ImageUploadButton(props) {
  const { folder, multiple, label, onUpload, onError } = props;
  // כדי שה-Widget לא ייווצר מחדש בכל רינדור
  const widgetRef = useRef(null);
  // כדי שה-Widget תמיד יקבל את הגרסה העדכנית של הפונקציות
  const callbacksRef = useRef({ onUpload, onError });

  useEffect(() => {
    callbacksRef.current = { onUpload, onError };
  });

  useEffect(() => {
    return () => widgetRef.current?.destroy();
  }, []);

  const openWidget = () => {
    if (!window.cloudinary) {
      onError("רכיב ההעלאה לא נטען. נסו לרענן את העמוד");
      return;
    }

    if (!widgetRef.current) {
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: CLOUD_NAME,
          apiKey: API_KEY,
          uploadPreset: UPLOAD_PRESET,
          folder,
          sources: ["local"],
          multiple: Boolean(multiple),
          maxFileSize: 10 * 1024 * 1024,
          clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
          uploadSignature: async (callback, paramsToSign) => {
            try {
              callback(await getUploadSignature(paramsToSign));
            } catch (err) {
              callbacksRef.current.onError(err.response?.data?.message || "אין הרשאה להעלות תמונות");
            }
          },
        },
        (error, result) => {
          if (error) {
            callbacksRef.current.onError("שגיאה בהעלאת התמונה");
            return;
          }
          if (result.event === "success") {
            callbacksRef.current.onUpload(result.info.secure_url);
          }
        }
      );
    }

    widgetRef.current.open();
  };

  return (
    <button type="button" onClick={openWidget} className={styles.button}>
      {label || "העלאת תמונה"}
    </button>
  );
}
