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
  function muBerat(x) {
    if (x <= 5) return 0;
    if (x >= 10) return 1;
    return (x - 5) / 5;
  }

  function muSedang(x) {
    if (x <= 5) return 1;
    if (x >= 10) return 0;
    return (10 - x) / 5;
  }

  function muKotorTinggi(x) {
    if (x <= 5) return 0;
    if (x >= 10) return 1;
    return (x - 5) / 5;
  }

  function zDeterjen(alpha) {
    return 20 + alpha * 80;
  }

  function hitungDetergen(berat, kotor) {
    const beratBerat = muBerat(berat);
    const beratSedang = muSedang(berat);
    const kotorTinggi = muKotorTinggi(kotor);

    const alpha1 = Math.min(beratBerat, kotorTinggi);
    const alpha2 = Math.min(beratSedang, kotorTinggi);

    const z1 = zDeterjen(alpha1);
    const z2 = zDeterjen(alpha2);

    const Z = (alpha1 * z1 + alpha2 * z2) / (alpha1 + alpha2);
    console.log(
      "Z: ",
      z1,
      z2,
      alpha1,
      alpha2,
      beratBerat,
      beratSedang,
      kotorTinggi,
    );
    return Z.toFixed(2);
  }

  const handleHitung = (e) => {
    e.preventDefault(); // penting biar form gak reload

    const berat = Number(beratPakaian);
    const kotor = Number(tingkatKotor);
    console.log(berat, kotor);
    const hasilPerhitungan = hitungDetergen(berat, kotor);
    console.log(hasilPerhitungan);
    setHasil(hasilPerhitungan);
  };

  console.log(hasil);
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
          <AccordionMultiple />
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
