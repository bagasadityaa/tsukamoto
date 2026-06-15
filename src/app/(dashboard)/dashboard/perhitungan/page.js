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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/firebase";
import { hitungDetergenTsukamoto } from "@/lib/tsukamoto";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
export default function PerhitunganDetergenPage() {
  const [data, setData] = useState([]);
  const router = useRouter();

  // Hapus state duplikat, pakai satu saja
  const [v, setV] = useState(""); // berat
  const [w, setW] = useState("10"); // warna — default value pertama
  const [x, setX] = useState(""); // kotor
  const [y, setY] = useState(""); // tebal

  const [result, setResult] = useState(null);

  const WARNA_OPTIONS = [
    { value: 10, label: "Hitam" },
    { value: 20, label: "Coklat, Biru Tua" },
    { value: 30, label: "Ungu, Merah Tua" },
    { value: 40, label: "Hijau Tua" },
    { value: 50, label: "Abu-Abu" },
    { value: 60, label: "Coklat Muda, Orange" },
    { value: 70, label: "Hijau Muda, Biru Muda" },
    { value: 80, label: "Merah Muda, Cream" },
    { value: 90, label: "Kuning Cerah" },
    { value: 100, label: "Putih" },
  ];
  const BERAT_OPTIONS = [
    { value: "<4", label: "Ringan" },
    { value: "2kg - 4", label: "Sedang" },
    { value: ">4", label: "Berat" },
  ];
  const KAIN_OPTIONS = [
    { value: "<2,5", label: "Ringan" },
    { value: "1,5 - 3,5", label: "Sedang" },
    { value: ">2,5", label: "Tebal" },
  ];

  const handleHitung = () => {
    if (!v || !w || !x || !y) {
      alert("Semua field harus diisi!");
      return;
    }
    const res = hitungDetergenTsukamoto(
      Number(v),
      Number(w),
      Number(x),
      Number(y),
    );
    setResult(res);
  };

  const handleSimpan = async () => {
    if (!result) {
      alert("Hitung dulu sebelum menyimpan!");
      return;
    }
    try {
      const res = {
        rules: result.ruleDetail || [],
        hasil: result.hasil || 0,
        beratKain: Number(v),
        ketebalanKain: Number(y),
        warnaKain: Number(w),
        kotorKain: Number(x),
        createdAt: new Date(),
      };
      const docRef = await addDoc(collection(db, "data"), { res });
      setData({ id: docRef.id, rules: result || [] });
      alert("Data berhasil disimpan!");
    } catch (err) {
      console.error("Error adding document:", err);
    }
  };

  const handleReset = () => {
    setResult(null);
    setV("");
    setW("10");
    setX("");
    setY("");
  };

  return (
    <div>
      <h1>Perhitungan Detergen</h1>

      <Card className="w-full my-2">
        <CardHeader>
          <CardTitle>Form Perhitungan Detergen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label>Berat (kg)</Label>
              <Input
                type="number"
                min={1}
                max={10}
                step={0.5}
                value={v}
                onChange={(e) => setV(e.target.value)}
                placeholder="1 – 10 kg"
              />
            </div>

            <div className="grid gap-2">
              <Label>Warna</Label>
              <select
                value={w}
                onChange={(e) => setW(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm bg-background"
              >
                {WARNA_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <Label>Tingkat Kotor</Label>
              <Input
                type="number"
                min={1}
                max={10}
                step={0.5}
                value={x}
                onChange={(e) => setX(e.target.value)}
                placeholder="1 – 10"
              />
            </div>

            <div className="grid gap-2">
              <Label>Ketebalan Kain</Label>
              <Input
                type="number"
                min={0.5}
                max={5}
                step={0.5}
                value={y}
                onChange={(e) => setY(e.target.value)}
                placeholder="0.5 – 5"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="grid grid-cols-2 gap-3">
          <Button className="w-full" variant="default" onClick={handleHitung}>
            Hitung
          </Button>
          <Button className="w-full" onClick={handleSimpan} variant="secondary">
            Simpan
          </Button>
          <Button
            className="w-full"
            onClick={() => router.push("/dashboard/riwayat")}
            variant="outline"
          >
            Lihat Riwayat
          </Button>
          <Button
            className="w-full"
            onClick={handleReset}
            variant="destructive"
          >
            Reset
          </Button>
        </CardFooter>
      </Card>

      {/* Hasil — tidak berubah */}
      {result && (
        <div className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Hasil Perhitungan</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Takaran Detergen
                  </p>
                  <h2 className="text-3xl font-bold">{result.hasil} ml</h2>
                </div>

                <div className="border rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground">Rule Aktif</p>
                  <h2 className="text-3xl font-bold">
                    {result.ruleDetail.length}
                  </h2>
                </div>

                <div className="border rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground">Defuzzifikasi</p>
                  <h2 className="text-xl font-bold">
                    {result.atas} / {result.bawah}
                  </h2>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Input</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid md:grid-cols-4 gap-3">
                <div className="border rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">Berat</p>
                  <p className="font-semibold">{v} Kg</p>
                </div>

                <div className="border rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">Warna</p>
                  <p className="font-semibold">{w}</p>
                </div>

                <div className="border rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">Tingkat Kotor</p>
                  <p className="font-semibold">{x}</p>
                </div>

                <div className="border rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">Ketebalan</p>
                  <p className="font-semibold">{y}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rule Yang Aktif</CardTitle>
            </CardHeader>

            <CardContent>
              {result.ruleDetail.map((rule, index) => (
                <div key={rule.ruleNo} className="border rounded-lg p-4 mb-3">
                  <h4 className="font-semibold mb-2">Rule Aktif {index + 1}</h4>

                  <div className="space-y-1 text-sm">
                    <p>
                      IF Berat = <b>{rule.IF.berat}</b>
                    </p>

                    <p>
                      AND Warna = <b>{rule.IF.warna}</b>
                    </p>

                    <p>
                      AND Kotor = <b>{rule.IF.kotor}</b>
                    </p>

                    <p>
                      AND Tebal = <b>{rule.IF.tebal}</b>
                    </p>

                    <p>
                      THEN Detergen = <b>{rule.out}</b>
                    </p>

                    <hr className="my-2" />

                    <p>
                      α-predikat : <b>{rule.alpha}</b>
                    </p>

                    <p>
                      Nilai z : <b>{rule.z}</b>
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
      <div className=" w-full my-2">
        <p className="text-lg font-semibold text-center">Nilai Variable</p>
        Warna .
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Value</TableHead>
              <TableHead className="w-[100px]">Invoice</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {WARNA_OPTIONS.map((w) => (
              <TableRow key={w.value}>
                <TableCell className="font-medium">{w.value}</TableCell>
                <TableCell className="font-medium">{w.label}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className=" w-full my-2">
        <p className="text-lg font-semibold text-center">
          Nilai Variabel Berat
        </p>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Nilai</TableHead>
              <TableHead className="w-[100px]">Keterangan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {BERAT_OPTIONS.map((w) => (
              <TableRow key={w.value}>
                <TableCell className="font-medium">{w.value}</TableCell>
                <TableCell className="font-medium">{w.label}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className=" w-full my-2">
        <p className="text-lg font-semibold text-center">Nilai Variabel Kain</p>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Nilai</TableHead>
              <TableHead className="w-[100px]">Keterangan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {KAIN_OPTIONS.map((w) => (
              <TableRow key={w.value}>
                <TableCell className="font-medium">{w.value}</TableCell>
                <TableCell className="font-medium">{w.label}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
