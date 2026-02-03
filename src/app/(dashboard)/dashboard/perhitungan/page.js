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
  const WARNA_MAX = 10;

  const TEBAL_MIN = 0;
  const TEBAL_MAX = 10;

  const BERAT_MIN = 1;
  const BERAT_MAX = 30;

  // Konstanta Output
  const DETERJEN_MIN = 20;
  const DETERJEN_MAX = 100;

  // 1. FUZZIFIKASI (Gunakan fungsi monoton yang konsisten)
  function muGelap(x) {
    if (x <= 0) return 1;
    if (x >= 10) return 0;
    return (10 - x) / 10; // Turun dari 1 ke 0
  }

  console.log(muGelap(6));

  function muTerang(x) {
    if (x <= 0) return 0;
    if (x >= 10) return 1;
    return x / 10; // Naik dari 0 ke 1
  }

  console.log(muTerang(6));

  function muTipis(x) {
    if (x <= 0) return 1;
    if (x >= 10) return 0;
    return (10 - x) / 10;
  }

  function muTebal(x) {
    if (x <= 0) return 0;
    if (x >= 10) return 1;
    return x / 10;
  }

  function muRingan(x) {
    if (x <= 0) return 1;
    if (x >= 30) return 0; // Sesuaikan dengan skala berat Anda (0-30)
    return (30 - x) / 30;
  }

  function muBerat(x) {
    if (x <= 0) return 0;
    if (x >= 30) return 1;
    return x / 30;
  }

  console.log(muBerat(25));

  // 2. INFERENSI (Output Z)
  function zSedikit(alpha) {
    return DETERJEN_MAX - alpha * (DETERJEN_MAX - DETERJEN_MIN);
  }

  function zBanyak(alpha) {
    return DETERJEN_MIN + alpha * (DETERJEN_MAX - DETERJEN_MIN);
  }

  function hitungDeterjen(warna, ketebalan, berat) {
    const gelap = muGelap(warna);
    const terang = muTerang(warna);
    const tipis = muTipis(ketebalan);
    const tebal = muTebal(ketebalan);
    const ringan = muRingan(berat);
    const beratK = muBerat(berat);

    const rules = [
      { alpha: Math.min(gelap, tipis, ringan), zType: "sedikit" },
      { alpha: Math.min(gelap, tebal, ringan), zType: "sedikit" },
      { alpha: Math.min(gelap, tipis, beratK), zType: "banyak" },
      { alpha: Math.min(gelap, tebal, beratK), zType: "banyak" },
      { alpha: Math.min(terang, tipis, ringan), zType: "sedikit" },
      { alpha: Math.min(terang, tebal, ringan), zType: "banyak" },
      { alpha: Math.min(terang, tipis, beratK), zType: "banyak" },
      { alpha: Math.min(terang, tebal, beratK), zType: "banyak" },
    ];

    // 3. DEFUZZIFIKASI
    let atas = 0;
    let bawah = 0;

    rules.forEach((r) => {
      if (r.alpha > 0) {
        const z = r.zType === "sedikit" ? zSedikit(r.alpha) : zBanyak(r.alpha);
        atas += r.alpha * z;
        bawah += r.alpha;
      }
    });

    return bawah === 0 ? 0 : (atas / bawah).toFixed(2);
  }

  // const hasil = hitungDeterjen(40, 7, 6);

  const handleHitung = () => {
    // Pastikan input dikonversi ke Number agar perhitungan matematikanya aman
    const warna = Number(warnaKain);
    const tebal = Number(ketebalanKain);
    const berat = Number(beratKain);

    // Jalankan fungsi logika Tsukamoto yang tadi kita buat
    const result = hitungDeterjen(warna, tebal, berat);

    // Simpan ke state untuk ditampilkan di UI
    setHasil(result);
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
