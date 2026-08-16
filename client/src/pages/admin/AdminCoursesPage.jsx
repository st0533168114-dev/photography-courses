import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCourses, deleteCourse } from "../../API/coursesApi";
import { useState } from "react";
import { getCategories } from "../../redux/slices/categoriesSlice";
export default function AdminCoursesPage(){
    const dispatch=useDispatch();
    const categoriesList=useSelector((state)=>state.categories.categoriesList||[]);

const [coursesList, setCoursesList] = useState([]);
const [isLoading, setIsLoading] = useState(true);//מייד כשהקומפננטה עולה הוא מתחיל לטעון את הקורסים
  const [error, setError] = useState(null);//צריך את זה?



useEffect(()=>{
const fetchCoursesData=async()=>{
    try{
     setIsLoading(true);
     const data=await getCourses();
     setCoursesList(data);
    }catch(err){
        setError(err);
    }finally{
        setIsLoading(false);
    }
 };
 fetchCoursesData();
},[]);//יתבצע רק כשהקומפוננטה עולה פעם ראשונה

//אם עדיין הקטגוריות לא נשלפו לסלייס-נפעיל דיספאצ
//אם לא נשלפו קטגוריות עדיין יופעל דיספאצ והיוז אפקט יגרום לקומפננטה להתרנדר מחדש וכך הסלקטור יביא את הקטגוריות מהשרת

useEffect(()=>{
    if(categoriesList.length===0){
        dispatch(getCategories());
    }
},[dispatch]);
const getCategoryNameById=(categoryId)=>{
    const category=categoriesList.find((cat)=>cat._id===categoryId);
    return category?category.categoryName:" ";
}

return(
    <div >
<h2>ניהול קורסים</h2>
{isLoading && <p>טוען קורסים...</p>}
{!isLoading&& coursesList.length===0 && <p>לא נמצאו קורסים</p>}
{error && <p>שגיאה: {error}</p>}
{!isLoading&& coursesList.length>0 && 
<table>
    <thead>
            <tr>
              <th>שם הקורס</th>
              <th>קטגוריה</th>
              <th>מחיר</th>
              <th>סטטוס</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {coursesList.map((c) =>(
                <tr key={c._id}>
                <td>{c.courseName}</td>
                <td>{getCategoryNameById(c.categoryId)}</td>
                <td>₪{c.price}</td>
                <td>{c.status === "available" ? "זמין" : "לא זמין"}</td>
                </tr>
            ))}
          </tbody>
</table>
        }

    </div>
);
}
