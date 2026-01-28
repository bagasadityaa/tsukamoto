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
  function muGelap(x) {
    if (x >= 0 && x <= 50) {
      return (50 - x) / 50;
    }
    return 0;
  }

  function muTerang(x) {
    if (x >= 50 && x <= 100) {
      return (x - 50) / 50;
    }
    return 0;
  }

  // Deterjen SEDIKIT (20–40 ml, menurun)
  function zSedikit(alpha) {
    // (40 - z) / 20 = alpha
    return 40 - alpha * 20;
  }

  // Deterjen BANYAK (40–60 ml, menaik)
  function zBanyak(alpha) {
    // (z - 40) / 20 = alpha
    return 40 + alpha * 20;
  }

  function hitungDeterjen(warna) {
    // 1. fuzzifikasi
    const gelap = muGelap(warna);
    const terang = muTerang(warna);

    // 2. rule
    const alpha1 = gelap; // R1: GELAP → SEDIKIT
    const alpha2 = terang; // R2: TERANG → BANYAK

    // 3. nilai z
    let z1 = 0,
      z2 = 0;

    if (alpha1 > 0) z1 = zSedikit(alpha1);
    if (alpha2 > 0) z2 = zBanyak(alpha2);

    // 4. defuzzifikasi
    const Z = (alpha1 * z1 + alpha2 * z2) / (alpha1 + alpha2 || 1); // biar ga NaN

    return Z;
  }

  console.log(hitungDeterjen(20)); // warna rendah
  console.log(hitungDeterjen(50)); // tengah
  console.log(hitungDeterjen(70)); // tinggi

  const handleHitung = () => {
    // pastikan angka
    const warna = Number(warnaKain);

    // 1. fuzzifikasi
    const gelap = muGelap(warna);
    const terang = muTerang(warna);

    // 2. rule
    const alpha1 = gelap; // R1: GELAP → SEDIKIT
    const alpha2 = terang; // R2: TERANG → BANYAK

    // 3. hitung z
    let z1 = 0;
    let z2 = 0;

    if (alpha1 > 0) z1 = zSedikit(alpha1);
    if (alpha2 > 0) z2 = zBanyak(alpha2);

    // 4. defuzzifikasi
    const Z = (alpha1 * z1 + alpha2 * z2) / (alpha1 + alpha2 || 1);

    console.log("Hasil deterjen:", Z);

    return Z;
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

              {/* BUTTON */}
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                Hitung Deterjen
              </button>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full" onClick={hitungDeterjen}>
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
