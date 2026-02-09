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
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function RiwayatPage() {
  const [data, setData] = useState([]);

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

  console.log("DATA:", data);

  return (
    <div>
      <h1>Riwayat Page</h1>
      <div className="grid">
        {data.map((r, i) => (
          <Card key={i} className="my-2 ">
            <CardHeader>
              <CardTitle>Berat Kain: {r.beratKain}kg</CardTitle>
              <CardTitle>Ketebalan Kain: {r.ketebalanKain} </CardTitle>
              <CardTitle>Warna Kain: {r.warnaKain} </CardTitle>
              <CardTitle>Detergen: {r.hasil}ml </CardTitle>
            </CardHeader>
            <CardContent>
              {r.rules.map((rule, j) => (
                <p key={j}>
                  {rule.name} - {rule.alpha.toFixed(2)} - {rule.zType} -{" "}
                  {rule.z.toFixed(2)}
                </p>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
