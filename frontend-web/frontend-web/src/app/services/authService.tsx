import getCookie from '../utils/getCookie';
import setCookie from '../utils/setCookie';

// تسجيل الدخول
export const login = async (email: string, password: string) => {
  const response = await fetch('http://127.0.0.1:8000/api/login/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });

  const data = await response.json();
  console.log("Login response:", data);

  if (data.access && data.refresh) {
    setCookie('access_token', data.access, 1); // خزّن التوكن في الكوكي
    return data;
  }

  throw new Error('Failed to login');
};

// تسجيل الخروج
export const logout = async () => {
  await fetch('http://127.0.0.1:8000/api/logout/', {
    method: 'POST',
    credentials: 'include',
  });
  localStorage.removeItem("user");
};

// جلب حالة المصادقة
export const getAuthStatus = async () => {
  const token = getCookie("access_token");
  
  const response = await fetch('http://127.0.0.1:8000/api/status/', {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  const data = await response.json();
  return data.user || null;
};

// جلب بيانات المستخدم
export const getUser = async () => {
  try {
    const user = await getAuthStatus(); // إعادة استخدام getAuthStatus
    console.log("User data:", user);
    return user;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null; // إذا حدث خطأ، أعد null
  }
};
