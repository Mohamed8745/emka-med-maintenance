"use client";

import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

import React, { ReactNode } from "react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth() as { user: any; loading: boolean };
  const router = useRouter();

  if (loading) return <div>Loading...</div>;
  if (!user) {
    router.push("/pages/login");
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
