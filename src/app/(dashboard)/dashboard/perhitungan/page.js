"use client";
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
import { hitungDetergenTsukamoto } from "@/lib/tsukamoto";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
export default function PerhitunganDetergenPage() {
  const [data, setData] = useState([]);
  const [mounted, setMounted] = useState(false);
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
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
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
        rules: result?.ruleDetail || [],
        hasil: result?.hasil || 0,
        beratKain: v,
        ketebalanKain: y,
        warnaKain: w,
        createdAt: new Date(),
      });

      // kalau mau simpan ID ke state
      setData({
        id: docRef.id,
        rules: result?.ruleDetail || [],
      });
      alert("data berhasil disimpan!");
      console.log("Document written with ID: ", data?.id, result?.ruleDetail);
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
            </div>
          </form>
        </CardContent>

        <CardFooter className="grid grid-cols-2 gap-3 ">
          <Button
            type="submit"
            className="w-full"
            variant="default"
            onClick={handleHitung}
          >
            Hitung
          </Button>
          <Button
            type="submit"
            className="w-full"
            onClick={handleSimpan}
            variant="secondary"
          >
            Simpan
          </Button>
          <Button
            type="submit"
            className="w-full"
            onClick={() => router.push("/dashboard/riwayat")}
            variant="outline"
          >
            Lihat Riwayat
          </Button>
          <Button
            type="submit"
            className="w-full"
            onClick={() => setResult(null)}
            variant="destructive"
          >
            Reset
          </Button>
        </CardFooter>
      </Card>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>Hasil</h3>

          <p>
            Takaran Detergen: <b>{result.hasil} ml</b>
          </p>

          <div>
            Rule:{" "}
            <b className="space-y-2 border-b-2">
              {result?.ruleDetail.map((rule) => (
                <div key={rule.ruleNo} className="border p-3 mb-2">
                  <p>Rule #{rule.ruleNo}</p>

                  <p>
                    IF Berat = {rule.IF.berat} AND Warna = {rule.IF.warna} AND
                    Kotor = {rule.IF.kotor} AND Tebal = {rule.IF.tebal}
                  </p>

                  <p>THEN = {rule.out}</p>
                  <p>Alpha = {rule.alpha}</p>
                  <p>Z = {rule.z}</p>
                </div>
              ))}
            </b>
          </div>

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
