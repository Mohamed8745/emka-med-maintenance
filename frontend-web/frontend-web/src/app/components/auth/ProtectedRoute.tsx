"use client";

import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect } from "react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth(); // لا حاجة إلى تحويل النوع الآن
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/pages/login");
    }
  }, [loading, user, router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return <>{children}</>;
};

export default ProtectedRoute;