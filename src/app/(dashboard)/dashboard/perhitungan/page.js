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

  const WARNA_MIN = 0;
  const WARNA_MAX = 100;

  const TEBAL_MIN = 0;
  const TEBAL_MAX = 10;

  const BERAT_MIN = 1;
  const BERAT_MAX = 30;

  // output deterjen (ml)
  const DETERJEN_MIN = 20;
  const DETERJEN_MAX = 100;

  // WARNA (0–100)
  function muGelap(x) {
    if (x <= 50) return (50 - x) / 50;
    if (x < 100) return (x - 50) / 50;
    return 0;
  }

  function muTerang(x) {
    if (x <= 50) return x / 50;
    if (x < 100) return (100 - x) / 50;
    return 0;
  }

  function muTipis(x) {
    if (x <= 5) return (5 - x) / 5;
    return 0;
  }

  function muTebal(x) {
    if (x >= 5) return (x - 5) / 5;
    return 0;
  }

  function muRingan(x) {
    if (x <= 15) return (15 - x) / 14;
    return 0;
  }

  function muBerat(x) {
    if (x >= 15) return (x - 15) / 15;
    return 0;
  }

  function zSedikit(alpha) {
    return DETERJEN_MAX - alpha * (DETERJEN_MAX - DETERJEN_MIN);
  }

  function zBanyak(alpha) {
    return DETERJEN_MIN + alpha * (DETERJEN_MAX - DETERJEN_MIN);
  }

  function hitungDeterjen(warna, ketebalan, berat) {
    // fuzzifikasi
    const gelap = muGelap(warna);
    const terang = muTerang(warna);

    const tipis = muTipis(ketebalan);
    const tebal = muTebal(ketebalan);

    const ringan = muRingan(berat);
    const beratK = muBerat(berat);

    // rule
    const rules = [
      { alpha: Math.min(gelap, tipis, ringan), z: "sedikit" },
      { alpha: Math.min(gelap, tebal, ringan), z: "sedikit" },
      { alpha: Math.min(gelap, tipis, beratK), z: "banyak" },
      { alpha: Math.min(gelap, tebal, beratK), z: "banyak" },

      { alpha: Math.min(terang, tipis, ringan), z: "sedikit" },
      { alpha: Math.min(terang, tebal, ringan), z: "banyak" },
      { alpha: Math.min(terang, tipis, beratK), z: "banyak" },
      { alpha: Math.min(terang, tebal, beratK), z: "banyak" },
    ];

    // defuzzifikasi
    let atas = 0;
    let bawah = 0;

    rules.forEach((r) => {
      if (r.alpha > 0) {
        const z = r.z === "sedikit" ? zSedikit(r.alpha) : zBanyak(r.alpha);

        atas += r.alpha * z;
        bawah += r.alpha;
      }
    });

    if (bawah === 0) return 0;

    return (atas / bawah).toFixed(2);
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
