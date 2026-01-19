"use client";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/lib/auth";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, loading } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);

  if (loading) return <p>Loading...</p>;
  return (
    <div>
      <h1>Halo, {user?.email}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
