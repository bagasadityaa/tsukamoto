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
  const [beratPakaian, setBeratPakaian] = useState("");
  const [tingkatKotor, setTingkatKotor] = useState("");
  const [warnaPakaian, setWarnaPakaian] = useState("");
  const [hasil, setHasil] = useState();

  // ===== konfigurasi (disesuaikan) =====
  const cfg = {
    berat: {
      mid: 5,
      max: 10,
    },
    // ubah mid/max kotor agar nilai kotor = 3 memberikan membership > 0
    kotor: {
      mid: 5, // sebelumnya 5
      max: 10, // sebelumnya 10
    },
    deterjen: {
      min: 20,
      max: 100,
    },
  };

  function muNaik(x, a, b) {
    if (x <= a) return 0;
    if (x >= b) return 1;
    return (x - a) / (b - a);
  }

  function muTurun(x, a, b) {
    if (x <= a) return 1;
    if (x >= b) return 0;
    return (b - x) / (b - a);
  }

  function muBerat(x, cfg) {
    return muNaik(x, cfg.berat.mid, cfg.berat.max);
  }

  function muSedang(x, cfg) {
    return muTurun(x, cfg.berat.mid, cfg.berat.max);
  }

  function muKotorTinggi(x, cfg) {
    return muNaik(x, cfg.kotor.mid, cfg.kotor.max);
  }

  function zDeterjen(alpha, cfg) {
    return cfg.deterjen.min + alpha * (cfg.deterjen.max - cfg.deterjen.min);
  }

  function hitungDetergen(berat, kotor, cfg) {
    const beratBerat = muBerat(berat, cfg);
    const beratSedang = muSedang(berat, cfg);
    const kotorTinggi = muKotorTinggi(kotor, cfg);

    // Rule 1: IF berat BERAT AND kotor TINGGI
    const alpha1 = Math.min(beratBerat, kotorTinggi);
    const z1 = zDeterjen(alpha1, cfg);

    // Rule 2: IF berat SEDANG AND kotor TINGGI
    const alpha2 = Math.min(beratSedang, kotorTinggi);
    const z2 = zDeterjen(alpha2, cfg);

    const totalAlpha = alpha1 + alpha2;
    if (totalAlpha === 0) return cfg.deterjen.min.toFixed(2); // kembalikan min sebagai fallback

    const Z = (alpha1 * z1 + alpha2 * z2) / totalAlpha;

    console.log({
      alpha1,
      alpha2,
      z1,
      z2,
      beratBerat,
      beratSedang,
      kotorTinggi,
      Z,
    });

    return Z.toFixed(2);
  }

  const handleHitung = (e) => {
    e.preventDefault();

    const berat = Number(beratPakaian);
    const kotor = Number(tingkatKotor);

    if (isNaN(berat) || isNaN(kotor)) {
      alert("Input tidak valid");
      return;
    }

    const hasilPerhitungan = hitungDetergen(berat, kotor, cfg);

    setHasil(hasilPerhitungan);
  };

  return (
    <div className="">
      <h1>Perhitungan Detergen</h1>

      <Card className="w-full my-2">
        <CardHeader>
          <CardTitle>Form Perhitungan Detergen</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleHitung}>
            <div className="flex flex-col gap-6">
              <div className="flex">
                <Label htmlFor="beratPakaian" className="w-fit mr-2">
                  Berat Pakaian (kg)
                </Label>
                <Input
                  id="beratPakaian"
                  type="number"
                  value={beratPakaian}
                  onChange={(e) => setBeratPakaian(e.target.value)}
                  required
                />
              </div>

              <div className="flex">
                <Label htmlFor="tingkatKotor" className="w-fit mr-2">
                  Tingkat Kotor
                </Label>
                <Input
                  id="tingkatKotor"
                  type="number"
                  value={tingkatKotor}
                  onChange={(e) => setTingkatKotor(e.target.value)}
                  required
                />
              </div>

              <div className="flex">
                <Label htmlFor="warnaPakaian" className="w-fit mr-2">
                  Warna Pakaian
                </Label>
                <Input
                  id="warnaPakaian"
                  type="text"
                  value={warnaPakaian}
                  onChange={(e) => setWarnaPakaian(e.target.value)}
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
            cfg={cfg}
            beratPakaian={beratPakaian}
            tingkatKotor={tingkatKotor}
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
