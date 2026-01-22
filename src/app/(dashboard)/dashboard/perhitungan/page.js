"use client";
import { AccordionMultiple } from "@/components/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export default function PerhitunganDetergenPage() {
  return (
    <div className="">
      <h1>Perhitungan Detergen</h1>

      <Card className="w-full my-2">
        <CardHeader>
          <CardTitle>Form Perhitungan Detergen</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className=" flex">
                <Label
                  htmlFor="beratPakaian"
                  className="w-fit text-nowrap mr-2"
                >
                  Berat Pakaian (kg)
                </Label>
                <Input id="beratPakaian" type="number" required />
              </div>
              <div className="grid gap-2">
                <div className="flex">
                  <Label
                    htmlFor="tingkatKotor"
                    className="w-fit mr-2 text-nowrap"
                  >
                    Tingkat Kotor
                  </Label>
                  <Input id="tingkatKotor" type="number" required />
                </div>
              </div>
              <div className="grid gap-2">
                <div className="flex">
                  <Label
                    htmlFor="warnaPakaian"
                    className="w-fit mr-2 text-nowrap"
                  >
                    Warna Pakaian
                  </Label>
                  <Input id="warnaPakaian" type="text" required />
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full">
            Hitung Takaran Detergen
          </Button>
        </CardFooter>
      </Card>

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
