"use client";

import { useEffect, useState } from "react";
import { login } from "@/lib/auth";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("karyawan"); // "admin" | "karyawan"
  const [error, setError] = useState("");
  const { user, loading } = useAuth();

  // useEffect harus di atas, sebelum return apapun
  useEffect(() => {
    if (!user) return;
    const checkRole = async () => {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const role = userDoc.data()?.role;
      if (role === "admin") {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/dashboard";
      }
    };
    checkRole();
  }, [user]);

  // Return loading SETELAH semua hooks
  if (loading) return null;
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await login(email, password);
      const uid = userCredential.user.uid;

      const userDoc = await getDoc(doc(db, "users", uid));
      const userRole = userDoc.data()?.role; // ✅ ganti nama agar tidak shadow state `role`

      if (role === "admin" && userRole !== "admin") {
        // Pilih login sebagai Admin, tapi di DB bukan admin
        alert("Akses ditolak: Anda bukan Admin.");
        await auth.signOut(); // logout agar session tidak tersimpan
        return;
      }

      if (role === "karyawan" && userRole !== "karyawan") {
        // Pilih login sebagai Karyawan, tapi di DB bukan karyawan (misal admin)
        alert("Akses ditolak: Silakan login sebagai Admin.");
        await auth.signOut();
        return;
      }

      // ✅ Role cocok, arahkan ke halaman yang sesuai
      if (userRole === "admin") {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      alert("Login gagal: " + err.message);
    }
  };

  return (
    <div className="flex h-screen w-full justify-center items-center">
      <Card className="w-full max-w-sm bg-gray-500/20">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent>
            <div className="flex flex-col gap-6">
              {/* Role Selector */}
              <div className="flex rounded-lg overflow-hidden border border-gray-300">
                <button
                  type="button"
                  onClick={() => setRole("karyawan")}
                  className={`flex-1 py-2 text-sm font-medium transition-colors ${
                    role === "karyawan"
                      ? "bg-primary text-primary-foreground"
                      : "bg-transparent text-muted-foreground hover:bg-gray-100/20"
                  }`}
                >
                  Karyawan
                </button>
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`flex-1 py-2 text-sm font-medium transition-colors ${
                    role === "admin"
                      ? "bg-primary text-primary-foreground"
                      : "bg-transparent text-muted-foreground hover:bg-gray-100/20"
                  }`}
                >
                  Admin
                </button>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  type="email"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <CardFooter className="w-full">
              <Button type="submit" className="w-full m-2">
                Login sebagai {role === "admin" ? "Admin" : "Karyawan"}
              </Button>
            </CardFooter>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
