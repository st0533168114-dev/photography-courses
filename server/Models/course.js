import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

// קורס בקטלוג. categoryId מקשר ל-categories, והמחיר כאן הוא מקור האמת בעת יצירת הזמנה
const CourseSchema = mongoose.Schema({
  courseName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  youtubeLink: String,
  courseImage: {
    type: String,
    trim: true,
    default: "https://res.cloudinary.com/tcs2p8ac/image/upload/v1792075678/0000738_-canon_600.jpg",
  },
  categoryId: {
    type: ObjectId,
    ref: "categories",
    required: true,
  },
  // קורס שאינו available נחסם לרכישה ביצירת הזמנה (orders.controller)
  // draft הוא מצב התחלתי שאיש לא מצביע עליו, ולכן המצב היחיד שממנו מותרת מחיקה קשיחה
  status: {
    type: String,
    enum: ["draft", "available", "notAvailable", "archived"],
    default: "draft",
  },
  courseDescription: {
    type: String,
     default: "",
  },
  courseContent: {
    type: [String],
    default: [],
  },
  images: {
    type: [String],
    default: [],
  },
});
export default mongoose.model("courses", CourseSchema);
