import { useState, useEffect } from "react";
import { addContactMessage } from "../api/contactMessageApi";
import styles from "../css/components/ContactUsSection.module.css";

const EMPTY_FORM = { firstName: "", lastName: "", phone: "", email: "", message: "" };

export default function ContactUsSection() {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSending, setIsSending] = useState(false);
  const [note, setNote] = useState(null);

  useEffect(() => {
    if (!note) return;
    const timer = setTimeout(() => setNote(null), 3000);
    return () => clearTimeout(timer);
  }, [note]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSending(true);
      await addContactMessage(formData);
      setFormData(EMPTY_FORM);
      setNote({ text: "ההודעה נשלחה בהצלחה, נחזור אליך בהקדם", isError: false });
    } catch (err) {
      setNote({ text: err.response?.data?.message || "השליחה נכשלה, נסו שוב מאוחר יותר", isError: true });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.heading}>צור קשר</h2>

      <p className={styles.info}>מירלה כהן</p>
      <p className={styles.info}>052-763-1008</p>
      <p className={styles.info}>c0527631008@gmail.com</p>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input type="text" name="firstName" placeholder="שם פרטי" value={formData.firstName} onChange={handleChange} required />
        <input type="text" name="lastName" placeholder="שם משפחה" value={formData.lastName} onChange={handleChange} required />
        <input type="text" name="phone" placeholder="טלפון" value={formData.phone} onChange={handleChange} required />
        <input type="email" name="email" placeholder="אימייל" value={formData.email} onChange={handleChange} required />

        <textarea name="message" placeholder="הודעה" value={formData.message} onChange={handleChange}></textarea>
        <div className={styles.submitWrapper}>
          {note && (
            <span className={`${styles.bubble} ${note.isError ? styles.bubbleError : ""}`} role="status">
              {note.text}
            </span>
          )}
          <button className={styles.submitButton} type="submit" disabled={isSending}>
            {isSending ? "שולח..." : "שלח"}
          </button>
        </div>
      </form>
    </div>
  );
}
