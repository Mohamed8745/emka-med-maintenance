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
    setCookie('refresh_token', data.refresh, 7); // افتراض أن الـ refresh token صالح لمدة 7 أيام
    return data;
  }

  throw new Error('Failed to login');
};

// تسجيل الخروج
export const logout = async () => {
  try {
    await fetch('http://127.0.0.1:8000/api/logout/', {
      method: 'POST',
      credentials: 'include',
    });
  } catch (error) {
    console.error("Error during logout request:", error);
  } finally {
    // إزالة جميع الكوكيز المتعلقة بالمصادقة
    setCookie('access_token', '', -1);
    setCookie('refresh_token', '', -1);
    setCookie('sessionid', '', -1); // حذف كوكي الجلسة
    localStorage.removeItem("user");
  }
};

// جلب حالة المصادقة
export const getAuthStatus = async () => {
  const accessToken = getCookie('access_token');
  if (!accessToken) {
    return null; // إذا لم يكن هناك توكن، لا داعي لاستدعاء الـ API
  }

  try {
    const response = await fetch('http://127.0.0.1:8000/api/status/', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error('Failed to fetch auth status');
    }

    const data = await response.json();
    return data.user || null;
  } catch (error) {
    console.error("Error fetching auth status:", error);
    return null;
  }
};

// جلب بيانات المستخدم
export const getUser = async () => {
  try {
    const user = await getAuthStatus();
    console.log("User data:", user);
    return user;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
  email: string;
  numidentif: string;
  numtel: string;
  image: string | null;
}

export async function updateUser(updatedUser: User, formData: FormData) {
  try {
    const accessToken = getCookie('access_token');
    const response = await fetch(`http://127.0.0.1:8000/utilisateurs/${updatedUser.id}/`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
      credentials: "include",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Server error:", errorText);
      throw new Error("Failed to update user");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}