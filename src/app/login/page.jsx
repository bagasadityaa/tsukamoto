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
      const role = userDoc.data()?.role;

      if (role === "admin") {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/bukanAdmin";
      }
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  };

  return (
    <div className="flex h-screen w-full justify-center items-center">
      <Card className="w-full max-w-sm bg-gray-500/20">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent>
            <div className="flex flex-col gap-6">
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
                Login
              </Button>
            </CardFooter>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
