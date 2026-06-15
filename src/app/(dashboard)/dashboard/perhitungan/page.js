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

  const handleHitung = () => {
    const res = hitungDetergenTsukamoto(
      Number(v),
      Number(w),
      Number(x),
      Number(y),
    );
    setResult(res);
  };
  const res = {
    rules: result?.ruleDetail || [],
    hasil: result?.hasil || 0,
    beratKain: v,
    ketebalanKain: y,
    warnaKain: w,
    kotorKain: x,
    createdAt: new Date(),
  };
  const handleSimpan = async () => {
    try {
      const docRef = await addDoc(collection(db, "data"), {
        res,
      });

      // kalau mau simpan ID ke state
      setData({
        id: docRef.id,
        rules: result || [],
      });
      alert("data berhasil disimpan!");
    } catch (err) {
      console.error("Error adding document:", err);
    }
  };

  console.log("data", res);
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
                <Input
                  type="number"
                  min="1"
                  max="8"
                  value={v}
                  onChange={(e) => setV(e.target.value)}
                />
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
        <div className="mt-6 space-y-6">
          {/* Hasil Utama */}
          <div className="rounded-xl bg-primary/10 border border-primary/20 p-4 text-center">
            <p className="text-sm text-muted-foreground">Takaran Detergen</p>
            <p className="text-3xl font-bold text-primary mt-1">
              {result.hasil} ml
            </p>
          </div>

          {/* Input & Derajat Keanggotaan */}
          <div className="grid  gap-4">
            <div className="rounded-xl border p-4 space-y-2">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Input
              </p>
              {Object.entries(result.input).map(([key, val]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="capitalize text-muted-foreground">
                    {key}
                  </span>
                  <span className="font-medium">{val}</span>
                </div>
              ))}
            </div>

            <div className="rounded-xl border p-4 space-y-2">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Derajat Keanggotaan
              </p>
              {Object.entries(result.mu).map(([key, vals]) => (
                <div key={key} className="text-sm">
                  <p className="capitalize font-medium">{key}</p>
                  <div className="flex gap-2 flex-wrap">
                    {Object.entries(vals).map(([label, val]) => (
                      <span
                        key={label}
                        className="text-xs bg-muted px-2 py-0.5 rounded-full"
                      >
                        {label}: {val}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rule Detail */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Rule Detail
            </p>
            {result.ruleDetail.map((rule) => (
              <div
                key={rule.ruleNo}
                className="rounded-xl border p-4 space-y-1 text-sm"
              >
                <p className="font-semibold text-primary">
                  Rule #{rule.ruleNo}
                </p>
                <p className="text-muted-foreground">
                  IF Berat ={" "}
                  <span className="text-foreground font-medium">
                    {rule.IF.berat}
                  </span>{" "}
                  AND Warna ={" "}
                  <span className="text-foreground font-medium">
                    {rule.IF.warna}
                  </span>{" "}
                  AND Kotor ={" "}
                  <span className="text-foreground font-medium">
                    {rule.IF.kotor}
                  </span>{" "}
                  AND Tebal ={" "}
                  <span className="text-foreground font-medium">
                    {rule.IF.tebal}
                  </span>
                </p>
                <div className="flex gap-4 pt-1">
                  <span>
                    THEN: <b>{rule.out}</b>
                  </span>
                  <span>
                    α: <b>{rule.alpha}</b>
                  </span>
                  <span>
                    Z: <b>{rule.z}</b>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="rounded-xl border p-4 flex justify-around text-center">
            <div>
              <p className="text-xs text-muted-foreground">Atas (Σαz)</p>
              <p className="text-lg font-bold">{result.atas}</p>
            </div>
            <div className="border-l" />
            <div>
              <p className="text-xs text-muted-foreground">Bawah (Σα)</p>
              <p className="text-lg font-bold">{result.bawah}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
