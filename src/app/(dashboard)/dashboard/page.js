"use client";
import { ChartAreaDefault } from "@/components/charts";
import { TableDemo } from "@/components/table-demo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/lib/auth";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <nav className="flex justify-between w-full items-center mx-2">
        <h1>Dashboard</h1>
        <div className="flex items-center space-x-2">
          <h1>Halo, {user?.email}</h1>
          <button onClick={logout} className="px-4 py-2 bg-gray-500 rounded-xl">
            Logout
          </button>
        </div>
      </nav>
      <div className="space-y-2">
        <div>
          <h1 className="text-lg font-bold">Ringkasan Hari ini</h1>
          <div className="grid grid-cols-2 lg:grid-cols-4 w-full space-x-2">
            <Card size="sm" className="p-2 my-2 w-full max-w-sm gap-1">
              <CardHeader className="px-2 ">
                <CardTitle>Total Perhitungan Hari Ini</CardTitle>
              </CardHeader>
              <CardContent className="px-2 flex">
                <p className="text-2xl">120</p>
              </CardContent>
            </Card>
            <Card size="sm" className="p-2 my-2 w-full max-w-sm gap-1">
              <CardHeader className="px-2 ">
                <CardTitle>Rata rata Takaran Detergen</CardTitle>
              </CardHeader>
              <CardContent className="px-2 flex space-x-1">
                <p className="text-2xl">120</p>
                <span className="flex items-end">ml</span>
              </CardContent>
            </Card>
            <Card size="sm" className="p-2 my-2 w-full max-w-sm gap-1">
              <CardHeader className="px-2 ">
                <CardTitle>Takaran Detergen Tertinggi</CardTitle>
              </CardHeader>
              <CardContent className="px-2 flex space-x-1">
                <p className="text-2xl">120</p>
                <span className="flex items-end">ml</span>
              </CardContent>
            </Card>
            <Card size="sm" className="p-2 my-2 w-full max-w-sm gap-1">
              <CardHeader className="px-2 ">
                <CardTitle>Takaran Detergen Terendah</CardTitle>
              </CardHeader>
              <CardContent className="px-2 flex space-x-1">
                <p className="text-2xl">120</p>
                <span className="flex items-end">ml</span>
              </CardContent>
            </Card>
          </div>
        </div>
        <div>
          <h1 className="text-lg font-bold">Grafik Riwayat Perhitungan</h1>
          <ChartAreaDefault />
        </div>
        <div>
          <h1 className="font-bold text-lg">Hasil Perhitungan Terakhir</h1>
          <TableDemo />
        </div>
      </div>
    </div>
  );
}
