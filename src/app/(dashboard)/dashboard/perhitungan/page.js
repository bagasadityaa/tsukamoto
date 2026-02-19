"use client";
import { AccordionMultiple } from "@/components/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/lib/firebase";
import usePerhitungan from "@/lib/perhitunganDetergen";
import { hitungDetergenTsukamoto } from "@/lib/tsukamoto";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/navigation";

import { useState } from "react";
export default function PerhitunganDetergenPage() {
  const [data, setData] = useState([]);
  const router = useRouter();
  // const {
  //   warnaKain,
  //   ketebalanKain,
  //   beratKain,
  //   hasil,
  //   setWarnaKain,
  //   setKetebalanKain,
  //   setBeratKain,
  //   handleHitung,
  //   WARNA_MAX,
  //   TEBAL_MAX,
  //   BERAT_MAX,
  //   rules,
  // } = usePerhitungan();

  const [v, setV] = useState("");
  const [w, setW] = useState("");
  const [x, setX] = useState("");
  const [y, setY] = useState("");
  const { hasilRule, mu } = hitungDetergenTsukamoto();
  const [result, setResult] = useState(null);

  const handleHitung = () => {
    const res = hitungDetergenTsukamoto(
      Number(v),
      Number(w),
      Number(x),
      Number(y),
    );
    setResult(res);
  };
  console.log(hasilRule);
  const handleSimpan = async () => {
    try {
      const docRef = await addDoc(collection(db, "data"), {
        rules: rules || [],
        hasil: hasil || 0,
        beratKain,
        ketebalanKain,
        warnaKain,
        createdAt: new Date(),
      });

      // kalau mau simpan ID ke state
      setData({
        id: docRef.id,
        rules: rules || [],
      });
      alert("data berhasil disimpan!");
    } catch (err) {
      console.error("Error adding document:", err);
    }
  };

  console.log("data", result);
  return (
    <div className="">
      <h1>Perhitungan Detergen</h1>

      <Card className="w-full my-2">
        <CardHeader>
          <CardTitle>Form Perhitungan Detergen</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault(); // biar ga reload
            }}
          >
            <div className="flex flex-col gap-6 ">
              <Label>
                Berat (Kg)
                <Input value={v ?? ""} onChange={(e) => setV(e.target.value)} />
              </Label>

              <Label>
                Warna (0-100)
                <Input value={w ?? ""} onChange={(e) => setW(e.target.value)} />
              </Label>

              <Label>
                Tingkat Kotor (1-10)
                <Input value={x ?? ""} onChange={(e) => setX(e.target.value)} />
              </Label>

              <Label>
                Ketebalan (mm)
                <Input value={y ?? ""} onChange={(e) => setY(e.target.value)} />
              </Label>

              <button onClick={handleHitung}>Hitung</button>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full" onClick={handleHitung}>
            Hitung Takaran Detergen
          </Button>
        </CardFooter>
      </Card>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>Hasil</h3>

          <p>
            Takaran Detergen: <b>{result.hasil} ml</b>
          </p>

          <p>Atas (Σαz): {result.atas}</p>
          <p>Bawah (Σα): {result.bawah}</p>

          <h4>Input</h4>
          <pre>{JSON.stringify(result.input, null, 2)}</pre>

          <h4>Derajat Keanggotaan</h4>
          <pre>{JSON.stringify(result.mu, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
