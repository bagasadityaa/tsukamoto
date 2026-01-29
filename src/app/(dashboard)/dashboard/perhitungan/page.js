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
import { useState } from "react";
export default function PerhitunganDetergenPage() {
  const [warnaKain, setWarnaKain] = useState("");
  const [ketebalanKain, setKetebalanKain] = useState("");
  const [beratKain, setBeratKain] = useState("");

  const [hasil, setHasil] = useState();
  // WARNA (0–100)
  const muGelap = (x) => (x <= 50 ? (50 - x) / 50 : 0);
  const muTerang = (x) => (x >= 50 ? (x - 50) / 50 : 0);

  // KETEBALAN (0–10)
  const muTipis = (x) => (x <= 5 ? (5 - x) / 5 : 0);
  const muTebal = (x) => (x >= 5 ? (x - 5) / 5 : 0);

  // BERAT (0–10)
  const muRingan = (x) => (x <= 5 ? (5 - x) / 5 : 0);
  const muBerat = (x) => (x >= 5 ? (x - 5) / 5 : 0);

  const zSedikit = (alpha) => 40 - alpha * 20; // 20–40
  const zBanyak = (alpha) => 40 + alpha * 20; // 40–60

  function hitungDeterjen(warna, ketebalan, berat) {
    // 1. fuzzifikasi
    const gelap = muGelap(warna);
    const terang = muTerang(warna);

    const tipis = muTipis(ketebalan);
    const tebal = muTebal(ketebalan);

    const ringan = muRingan(berat);
    const beratK = muBerat(berat);

    // 2. rule
    // R1: GELAP & TIPIS & RINGAN → SEDIKIT
    const alpha1 = Math.min(gelap, tipis, ringan);

    // R2: TERANG & TEBAL & BERAT → BANYAK
    const alpha2 = Math.min(terang, tebal, beratK);

    // 3. nilai z
    const z1 = alpha1 > 0 ? zSedikit(alpha1) : 0;
    const z2 = alpha2 > 0 ? zBanyak(alpha2) : 0;

    // 4. defuzzifikasi
    const Z = (alpha1 * z1 + alpha2 * z2) / (alpha1 + alpha2 || 1);

    return Z;
  }
  // const hasil = hitungDeterjen(40, 7, 6);

  const handleHitung = () => {
    const result = hitungDeterjen(warnaKain, ketebalanKain, beratKain);
    return setHasil(result);
  };
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
                <Input
                  id="warnaKain"
                  type="number"
                  value={warnaKain}
                  onChange={(e) => setWarnaKain(Number(e.target.value))}
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="ketebalanKain" className="w-32">
                  Ketebalan Kain
                </Label>
                <Input
                  id="ketebalanKain"
                  type="number"
                  value={ketebalanKain}
                  onChange={(e) => setKetebalanKain(Number(e.target.value))}
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="beratKain" className="w-32">
                  Berat Kain
                </Label>
                <Input
                  id="beratKain"
                  type="number"
                  value={beratKain}
                  onChange={(e) => setBeratKain(Number(e.target.value))}
                  required
                />
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

      <p className="text-sm text-muted-foreground">Warna kain</p>

      <p className="text-2xl font-bold">{warnaKain} ml</p>
      <p className="text-sm text-muted-foreground">Berat kain</p>
      <p className="text-2xl font-bold">{beratKain} ml</p>
      <p className="text-sm text-muted-foreground">Ketebalan kain</p>
      <p className="text-2xl font-bold">{ketebalanKain} ml</p>
      {hasil && (
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">Warna kain</p>

          <p className="text-2xl font-bold">{warnaKain} ml</p>
          <p className="text-sm text-muted-foreground">Takaran Detergen</p>
          <p className="text-2xl font-bold">{hasil} ml</p>
        </div>
      )}

      <Card className="w-full my-2">
        <CardHeader>
          <CardTitle>Detail Proses Fuzzy</CardTitle>
        </CardHeader>
        <CardContent>
          <AccordionMultiple
            beratKain={beratKain}
            ketebalanKain={ketebalanKain}
            warnaKain={warnaKain}
            handleHitung={handleHitung}
          />
        </CardContent>
        <CardFooter className="grid grid-cols-3 space-x-2 justify-between">
          <Button type="submit">Simpan Hasil Perhitungan</Button>
          <Button type="submit" variant="secondary">
            Reset
          </Button>
          <Button type="submit" variant="outline">
            Lihat Riwayat
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
