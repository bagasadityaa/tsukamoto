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
import { hitungDetergen } from "@/lib/tsukamoto";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/navigation";

import { useState } from "react";
export default function PerhitunganDetergenPage() {
  const [data, setData] = useState([]);
  const router = useRouter();
  const {
    warnaKain,
    ketebalanKain,
    beratKain,
    hasil,
    setWarnaKain,
    setKetebalanKain,
    setBeratKain,
    handleHitung,
    WARNA_MAX,
    TEBAL_MAX,
    BERAT_MAX,
    rules,
  } = usePerhitungan();

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

  console.log("data", data);
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
              hitungDeterjen(); // fungsi fuzzy kamu
            }}
          >
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <Label htmlFor="warnaKain" className="w-32">
                  Warna Kain
                </Label>
                <div className="flex flex-col w-full">
                  <Input
                    id="warnaKain"
                    type="number"
                    value={warnaKain}
                    max={WARNA_MAX}
                    onChange={(e) => setWarnaKain(Number(e.target.value))}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Max: {WARNA_MAX}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="ketebalanKain" className="w-32">
                  Ketebalan Kain
                </Label>
                <div className="flex w-full flex-col">
                  <Input
                    id="ketebalanKain"
                    type="number"
                    value={ketebalanKain}
                    onChange={(e) => setKetebalanKain(Number(e.target.value))}
                    required
                    max={TEBAL_MAX}
                  />
                  <p className="text-sm text-muted-foreground">
                    Max: {TEBAL_MAX}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="beratKain" className="w-32">
                  Berat Kain
                </Label>
                <div className="flex w-full flex-col">
                  <Input
                    id="beratKain"
                    type="number"
                    value={beratKain}
                    onChange={(e) => setBeratKain(Number(e.target.value))}
                    required
                    max={BERAT_MAX}
                  />
                  <p className="text-sm text-muted-foreground">
                    Max: {BERAT_MAX}
                  </p>
                </div>
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full" onClick={handleHitung}>
            Hitung Takaran Detergen
          </Button>
        </CardFooter>
      </Card>

      {hasil && (
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">Takaran Detergen</p>
          <p className="text-2xl font-bold">{hasil} ml</p>
        </div>
      )}
      {hasil === null ? null : (
        <Card className="w-full my-2">
          <CardHeader>
            <CardTitle>Detail Proses Fuzzy</CardTitle>
          </CardHeader>
          <CardContent>
            <AccordionMultiple
              rules={rules}
              beratkain={beratKain}
              ketebalanKain={ketebalanKain}
              warnaKain={warnaKain}
              hasil={hasil}
              handleHitung={handleHitung}
            />
          </CardContent>
          <CardFooter className="grid grid-cols-2 space-x-2 justify-between">
            <Button onClick={handleSimpan} type="submit">
              Simpan
            </Button>
            <Button
              onClick={() => router.push("/dashboard/riwayat")}
              variant="outline"
            >
              Lihat Riwayat
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
