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
  
  const response = await fetch('http://127.0.0.1:8000/api/status/', {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
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


interface User {
  id: number;
  // Add other properties of the user object as needed
}

export async function updateUser(updatedUser: User, formData: FormData) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/utilisateurs/${updatedUser.id}/`, {
      method: "PUT",
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

import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/",
  withCredentials: true, // يدعم الـ JWT في HttpOnly cookies
});

const authService = {
  getStocks: async () => {
    try {
      const res = await API.get("/stocks/");
      return res.data;
    } catch (err) {
      console.error("فشل في جلب المخازن", err);
      return null;
    }
  },

  addStock: async (data: Record<string, any>) => {
    try {
      const res = await API.post("/stocks/", data);
      return res.data;
    } catch (err) {
      console.error("فشل في إضافة المخزن", err);
      return null;
    }
  },

  // يمكن إضافة خدمات أخرى لاحقًا
};

export default authService;