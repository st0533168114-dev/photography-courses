import CommentItem from "./CommentItem";
import styles from "../CSS/components/CommentsSection.module.css";
export default function CommentsSection() {
  return (
    <div className={styles.section}>
      {/* בלולאה תגובות איכשהו */}
      <CommentItem />
      <CommentItem />
      <CommentItem />
    </div>
  );
}
