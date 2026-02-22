"use client";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/firebase";
import { createDropdownMenuScope } from "@radix-ui/react-dropdown-menu";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function RiwayatPage() {
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

  useEffect(() => {
    setMounted(true);
  });
  if (!mounted) return null;
  if (typeof window !== "undefined") console.log("data", data);
  return (
    <div>
      <h1>Riwayat Page</h1>
      <div className="grid">
        {data.map((r, i) => (
          <Card key={i} className="my-4">
            <CardHeader>
              <CardTitle>Detail Pencucian</CardTitle>

              <div className="text-sm space-y-1">
                <p>Berat Kain: {r.res?.beratKain} kg</p>
                <p>Ketebalan Kain: {r.res?.ketebalanKain} mm</p>
                <p>Warna Kain: {r.res?.warnaKain}</p>
                <p>Kotor Kain: {r.res?.kotorKain}</p>
                <p className="font-semibold">
                  Hasil Detergen: {r.res?.hasil} ml
                </p>
              </div>
            </CardHeader>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rule</TableHead>
                    <TableHead>IF</TableHead>
                    <TableHead>Output</TableHead>
                    <TableHead>Alpha</TableHead>
                    <TableHead>Z</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {r.res?.rules?.map((rule, j) => (
                    <TableRow key={j}>
                      <TableCell>R{rule.ruleNo}</TableCell>

                      <TableCell>
                        Berat {rule.IF.berat}, Warna {rule.IF.warna}, Kotor{" "}
                        {rule.IF.kotor}, Tebal {rule.IF.tebal}
                      </TableCell>

                      <TableCell>{rule.out}</TableCell>

                      <TableCell>{rule.alpha.toFixed(3)}</TableCell>

                      <TableCell>{rule.z.toFixed(3)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
