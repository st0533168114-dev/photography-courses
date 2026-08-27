
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCart, clearCart } from "../redux/slices/shoppingCartSlice";
import { updateUserCourses } from "../redux/slices/authSlice";
import { addOrder } from "../API/orderApi";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
export default function CreateOrderPage () {
    const dispatch = useDispatch();
    const navigate = useNavigate();
   // TODO: כרגע פרטי המזמין נלקחים מפרטי המשתמש השמורים. יש לקלוט אותם כאן בטופס, כולל פרטי אשראי 

 const user=useSelector((state)=>state.auth.user);
 const cart=useSelector((state)=>state.shoppingCart.cart);
 const isCartLoading =useSelector((state)=>state.shoppingCart.isLoading);

 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

useEffect(()=>{
    dispatch(getCart());
},[dispatch]);

const courseList = cart?.courseList||[];
const subtotal=cart?.subtotal||0;

const handleCreateOrder = async (e) => {
    e.preventDefault(); 
    setError(null);
    setIsSubmitting(true);

    try {
        // השרת בונה את ההזמנה מעגלת הקניות של המשתמש, ולכן גוף הבקשה ריק בכוונה
        const response = await addOrder({});

        // עדכון הקורסים בסטייט הוא מה שפותח גישה מיידית ל"הקורסים שלי" בלי בקשה נוספת לשרת
        if (response?.user?.courseIds) {
            dispatch(updateUserCourses(response.user.courseIds));
        }

        await dispatch(clearCart());

        navigate("/paymentConfirmation");

    } catch (err) {
        setError(err.message || "יצירת ההזמנה נכשלה נסה שוב");
    } finally {
        setIsSubmitting(false);
    }
};
if (isSubmitting) {
  return (
    <>
      <Header />
      <h2>מעבד את ההזמנה...</h2>
      <p>אנא המתן.</p>
      <Footer />
    </>
  );
}

   return (
     <>
      <Header />

      <h2>ביצוע רכישה</h2>

    <p>{user?.firstName} {user?.lastName}</p>
      <p>{user?.phoneNumber}</p>
      <p>{user?.email}</p>

{isCartLoading ? (
   <p>טוען את פרטי ההזמנה...</p>
) : courseList.length===0 ? (
   <p>עגלת הקניות שלך ריקה.</p>
) : (
<form onSubmit={handleCreateOrder}>
    {courseList.map((course)=>(
        <p key={course.courseId}>
           {course.courseName} - {course.price} ₪
        </p>
    ))}
   <h3>סה"כ לתשלום: {subtotal} ₪</h3>
{error&&<p>{error}</p>}
         <button type="submit" disabled={isSubmitting}> יצירת הזמנה</button>
        </form>
      )}

      <Footer />

    </> );

}