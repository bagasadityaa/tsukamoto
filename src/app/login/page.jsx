"use client";

import { useState } from "react";
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
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();

  if (user) {
    window.location.href = "/dashboard";
  }
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.message);
      alert("Login failed: " + err.message);
    }
  };

  return (
    <div className="flex h-screen w-full justify-center items-center ">
      <Card className="w-full max-w-sm bg-gray-500/20">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
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
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <CardFooter className="w-full">
              <Button type="submit" className="w-full  m-2">
                Login
              </Button>
            </CardFooter>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
