import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AdminTable from "../../components/AdminTable";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import { DeleteIcon } from "../../components/admin/AdminIcons";
import { getUserById, updateUser, deleteUser } from "../../API/userApi";
import { getOrders } from "../../API/orderApi";
import { getCourses } from "../../redux/slices/coursesSlice";
import styles from "../../CSS/pages/admin/AdminUserDetailsPage.module.css";

export default function AdminUserDetailsPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);
  const coursesList = useSelector((state) => state.courses.coursesList || []);
  const coursesLoading = useSelector((state) => state.courses.isLoading);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("orders");
  const [userOrders, setUserOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [courseToRemove, setCourseToRemove] = useState(null);
  // שגיאת שליפה מקומית ולא מהסטור - רק כישלון בטעינה מצדיק להחליף את הטבלה בהודעת שגיאה
  const [coursesLoadError, setCoursesLoadError] = useState(null);

  const isSelf = authUser?._id === userId;

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        const userData = await getUserById(userId);
        setUser(userData);
        setLoadError(null);
      } catch (err) {
        setLoadError(err.response?.data?.message || "שגיאה בטעינת פרטי המשתמש");
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, [userId]);

  useEffect(() => {
    const loadOrders = async () => {
      setOrdersLoading(true);
      try {
        const ordersList = await getOrders(userId);
        setUserOrders(ordersList);
        setOrdersError(null);
      } catch (err) {
        setOrdersError(err.response?.data?.message || "שגיאה בטעינת ההזמנות");
      } finally {
        setOrdersLoading(false);
      }
    };
    loadOrders();
  }, [userId]);

  // שליפת קורסים רק אם עדיין לא נשלפו - נדרשים כדי להציג שמות מול ה-courseIds של המשתמש
  useEffect(() => {
    const loadCourses = async () => {
      try {
        if (coursesList.length === 0) {
          await dispatch(getCourses()).unwrap();
        }
      } catch (err) {
        setCoursesLoadError(err || "שגיאה בטעינת הקורסים");
      }
    };
    loadCourses();
  }, [dispatch]);

  const handleToggleStatus = async () => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    try {
      await updateUser(userId, { status: newStatus });
      setUser((prevUser) => ({ ...prevUser, status: newStatus }));
      setActionError(null);
    } catch (err) {
      setActionError(err.response?.data?.message || "שגיאה בעדכון הסטטוס");
    }
  };

  const saveCourseIds = async (nextCourseIds) => {
    const updatedUser = await updateUser(userId, { courseIds: nextCourseIds });
    setUser(updatedUser);
  };

  const handleGrantCourse = async () => {
    try {
      await saveCourseIds([...(user.courseIds || []), selectedCourseId]);
      setSelectedCourseId("");
      setActionError(null);
    } catch (err) {
      setActionError(err.response?.data?.message || "שגיאה בהענקת הקורס");
    }
  };

  const handleConfirmRemoveCourse = async () => {
    try {
      await saveCourseIds((user.courseIds || []).filter((courseId) => courseId !== courseToRemove));
      setCourseToRemove(null);
      setActionError(null);
    } catch (err) {
      setCourseToRemove(null);
      setActionError(err.response?.data?.message || "שגיאה בהסרת הקורס");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteUser(userId);
      setDialogOpen(false);
      navigate("/admin/users/list");
    } catch (err) {
      setDialogOpen(false);
      setActionError(err.response?.data?.message || "שגיאה במחיקת המשתמש");
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>טוען נתונים...</div>;
  }

  if (loadError) {
    return <div className={styles.error}>שגיאה: {loadError}</div>;
  }

  if (!user) {
    return <div className={styles.error}>המשתמש לא נמצא</div>;
  }

  const isActive = user.status === "active";

  const userCourseIds = user.courseIds || [];
  const userCourses = coursesList.filter((course) => userCourseIds.includes(course._id));
  const availableCourses = coursesList.filter((course) => !userCourseIds.includes(course._id));

  const courseColumns = [
    { key: "courseName", label: "שם הקורס" },
    { key: "price", label: "מחיר", render: (value) => `₪${value}` },
    {
      key: "actions",
      label: "פעולות",
      align: "center",
      render: (value, row) => (
        <button
          type="button"
          className={styles.removeCourseBtn}
          onClick={() => setCourseToRemove(row._id)}
          title="הסרת גישה לקורס"
          aria-label="הסרת גישה לקורס"
        >
          <DeleteIcon />
        </button>
      ),
    },
  ];

  const orderColumns = [
    {
      key: "_id",
      label: "מס' הזמנה",
      render: (value) => (
        <Link className={styles.orderLink} to={`/admin/orders/${value}`} title="מעבר לעמוד ההזמנה">
          #{value.slice(-6)}
        </Link>
      ),
    },
    { key: "orderDate", label: "תאריך", render: (value) => new Date(value).toLocaleDateString("he-IL") },
    { key: "coursesList", label: "מס' קורסים", align: "center", render: (value) => value?.length || 0 },
    { key: "totalAmount", label: "סכום כולל", render: (value) => `₪${value}` },
    { key: "status", label: "סטטוס", render: (value) => (value === "completed" ? "הושלמה" : "לא הושלמה") },
    {
      key: "paymentsList",
      label: "שולם",
      align: "center",
      render: (value) => {
        // התשלומים הגיעו כבר ב-populate של ההזמנה, ולכן הסימון נגזר מהם בלי קריאה נוספת
        const isPaid = value?.some((payment) => payment?.status === "success");
        return <span className={isPaid ? styles.paidBadge : styles.unpaidBadge}>{isPaid ? "כן" : "לא"}</span>;
      },
    },
  ];

  return (
    <div className={styles.container}>
      <AdminPageHeader title={`ניהול משתמש: ${user.firstName} ${user.lastName}`} />

      {actionError && <div className={styles.error}>{actionError}</div>}

      <div className={styles.card}>
        <div className={styles.detailsGrid}>
          <span className={styles.label}>שם מלא</span>
          <span className={styles.value}>
            {user.firstName} {user.lastName}
          </span>

          <span className={styles.label}>שם משתמש</span>
          <span className={styles.value}>{user.userName}</span>

          <span className={styles.label}>אימייל</span>
          <span className={styles.value}>{user.email}</span>

          <span className={styles.label}>טלפון</span>
          <span className={styles.value}>{user.phoneNumber}</span>

          <span className={styles.label}>תפקיד</span>
          <span className={styles.value}>{user.role === "admin" ? "מנהל" : "לקוח"}</span>

          <span className={styles.label}>סטטוס</span>
          <span className={styles.value}>
            <span className={isActive ? styles.activeBadge : styles.inactiveBadge}>
              {isActive ? "פעיל" : "לא פעיל"}
            </span>
          </span>
        </div>

        <div className={styles.actions}>
          <button className={styles.editBtn} onClick={() => navigate(`/admin/users/${userId}/edit`)}>
            עריכת פרטים
          </button>

          {!isSelf && (
            <>
              <button className={styles.statusBtn} onClick={handleToggleStatus}>
                {isActive ? "הפוך ללא פעיל" : "הפוך לפעיל"}
              </button>
              <button className={styles.deleteBtn} onClick={() => setDialogOpen(true)}>
                מחיקה לצמיתות
              </button>
            </>
          )}
        </div>

        {isSelf && <p className={styles.selfNote}>זהו החשבון שלך — שינוי סטטוס ומחיקה אינם זמינים.</p>}
      </div>

      <div className={styles.tabsCard}>
        <div className={styles.tabs} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "orders"}
            className={`${styles.tab} ${activeTab === "orders" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            הזמנות
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "courses"}
            className={`${styles.tab} ${activeTab === "courses" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("courses")}
          >
            קורסים
          </button>
        </div>

        <div className={styles.tabPanel}>
          {activeTab === "orders" && (
            <AdminTable
              columns={orderColumns}
              rows={userOrders}
              loading={ordersLoading}
              error={ordersError}
              emptyMessage="למשתמש אין הזמנות"
            />
          )}

          {activeTab === "courses" && (
            <>
              <div className={styles.grantRow}>
                <select
                  className={styles.grantSelect}
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  aria-label="בחירת קורס להענקה"
                >
                  <option value="">בחר קורס להענקה</option>
                  {availableCourses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.courseName}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className={styles.grantBtn}
                  onClick={handleGrantCourse}
                  disabled={!selectedCourseId}
                >
                  הענק קורס
                </button>
              </div>

              <p className={styles.grantNote}>
                הענקת קורס נותנת גישה לצפייה בלבד — לא נוצרת הזמנה ולא תשלום, והקורס לא ייספר במכירות.
              </p>

              <AdminTable
                columns={courseColumns}
                rows={userCourses}
                loading={coursesLoading}
                error={coursesLoadError}
                emptyMessage="למשתמש אין קורסים"
              />
            </>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={dialogOpen}
        title="מחיקת משתמש לצמיתות"
        message="מחיקת המשתמש אינה מוחקת את ההזמנות והתשלומים שלו — הם יישארו במסד ללא משתמש משויך. אם המטרה היא רק לחסום גישה, עדיף להפוך את המשתמש ללא פעיל. למחוק בכל זאת?"
        confirmLabel="מחק לצמיתות"
        cancelLabel="ביטול"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDialogOpen(false)}
        isDangerous={true}
      />

      <ConfirmDialog
        open={Boolean(courseToRemove)}
        title="הסרת גישה לקורס"
        message="הסרת הקורס מבטלת למשתמש את הגישה לצפייה בו. הקורס עצמו נשאר בקטלוג, וההזמנה והתשלום, אם היו, נשארים במערכת. להסיר?"
        confirmLabel="הסר גישה"
        cancelLabel="ביטול"
        onConfirm={handleConfirmRemoveCourse}
        onCancel={() => setCourseToRemove(null)}
        isDangerous={true}
      />
    </div>
  );
}
