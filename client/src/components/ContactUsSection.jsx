import { useState } from "react";
import styles from "../CSS/components/ContactUsSection.module.css";
export default function ContactUsSection() {
      //כרגע לא קורה כלום בשליחת הודעה רק השדות נמחקים
  const [showModal, setShowModal]=useState(false);
  function handleSubmit(e){
    e.preventDefault();//מניעת רענון הדף
    e.target.reset();// מאפס את השדות
    setShowModal(true);
    //הצגה ל3 שניות בלבד
    setTimeout(()=>{
      setShowModal(false);
    },3000);

  }
  return (
    <div className={styles.section}>
      <h2 className={styles.heading}>צור קשר</h2>

      <p className={styles.info}>מירלה כהן</p>
      <p className={styles.info}>052-763-1008</p>
      <p className={styles.info}>c0527631008@gmail.com</p>
<form className={styles.form} onSubmit={handleSubmit}>
      <input type="text" placeholder="שם פרטי" required />
       <input type="text" placeholder="שם משפחה" required />
      <input type="text" placeholder="טלפון" required/>
      <input type="email" placeholder="אימייל" required/>

      <textarea placeholder="הודעה"></textarea>
      <button className={styles.submitButton} type="submit">שלח</button>
</form>
{showModal&&(
  <div className={styles.modalOverlay}>
<div className={styles.modal}>
  <h3 className={styles.modalTitle}>ההודעה נשלחה בהצלחה</h3>
  <p className={styles.modalText}>נחזור אליך בהקדם</p>
</div>
  </div>
)}

    </div>
  );
}
