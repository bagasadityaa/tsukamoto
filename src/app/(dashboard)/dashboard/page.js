"use client";
import { ChartAreaDefault } from "@/components/charts";
import { TableDemo } from "@/components/table-demo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [mounted, setMounted] = useState(false);

  const ambilData = async () => {
    try {
      const response = await getDocs(collection(db, "data"));

      const hasil = response.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setData(hasil);
    } catch (err) {
      console.error("Error getting documents:", err);
    }
  };
  useEffect(() => {
    ambilData();
  }, []);
  // filter hanya hari ini
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  const dataToday = data.filter((item) => {
    if (!item?.res.createdAt) return false;

    const itemDate =
      typeof item?.res.createdAt.toDate === "function"
        ? item?.res.createdAt.toDate()
        : new Date(item?.res.createdAt);

    return itemDate.toISOString().split("T")[0] === todayString;
  });

  // total
  const totalToday = dataToday.length;

  // ambil semua hasil dalam bentuk number
  const hasilList = dataToday.map((item) => Number(item.hasil));

  // rata-rata
  const rataRata =
    hasilList.length > 0
      ? hasilList.reduce((a, b) => a + b, 0) / hasilList.length
      : 0;

  // tertinggi
  const tertinggi = hasilList.length > 0 ? Math.max(...hasilList) : 0;

  // terendah
  const terendah = hasilList.length > 0 ? Math.min(...hasilList) : 0;
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
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 w-full space-x-2">
            <Card size="sm" className="p-2 my-2 w-full max-w-sm gap-1">
              <CardHeader className="px-2 ">
                <CardTitle>Total Perhitungan Hari Ini</CardTitle>
              </CardHeader>
              <CardContent className="px-2 flex">
                <p className="text-2xl">{totalToday} ml</p>
              </CardContent>
            </Card>
            <Card size="sm" className="p-2 my-2 w-full max-w-sm gap-1">
              <CardHeader className="px-2 ">
                <CardTitle>Rata rata Takaran Detergen</CardTitle>
              </CardHeader>
              <CardContent className="px-2 flex space-x-1">
                <p className="text-2xl">{rataRata.toFixed(2)}</p>
                <span className="flex items-end">ml</span>
              </CardContent>
            </Card>
            <Card size="sm" className="p-2 my-2 w-full max-w-sm gap-1">
              <CardHeader className="px-2 ">
                <CardTitle>Takaran Detergen Tertinggi</CardTitle>
              </CardHeader>
              <CardContent className="px-2 flex space-x-1">
                <p className="text-2xl">{tertinggi.toFixed(2)}</p>
                <span className="flex items-end">ml</span>
              </CardContent>
            </Card>
            <Card size="sm" className="p-2 my-2 w-full max-w-sm gap-1">
              <CardHeader className="px-2 ">
                <CardTitle>Takaran Detergen Terendah</CardTitle>
              </CardHeader>
              <CardContent className="px-2 flex space-x-1">
                <p className="text-2xl">{terendah.toFixed(2)}</p>
                <span className="flex items-end">ml</span>
              </CardContent>
            </Card>
          </div>
        </div>
        <div>
          <h1 className="text-lg font-bold">Grafik Riwayat Perhitungan</h1>
          <ChartAreaDefault data={data} />
        </div>
        <div>
          <h1 className="font-bold text-lg">Hasil Perhitungan Terakhir</h1>
          <TableDemo data={data} />
        </div>
      </div>
    </div>
  );
}
