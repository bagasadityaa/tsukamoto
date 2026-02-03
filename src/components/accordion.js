import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BlockMath } from "react-katex";
import { TableDemo } from "./table-demo";
import usePerhitungan from "@/lib/perhitunganDetergen";
import { useState } from "react";

export function AccordionMultiple({
  rules,
  beratkain,
  ketebalanKain,
  handleHitung,
  warnaKain,
}) {
  // --- Tabel Fuzzifikasi ---
  const fuzzifikasiTableHead = [
    { label: "Variable", key: "variable" },
    { label: "Himpunan", key: "himpunan" },
    { label: "Rumus", key: "rumus" },
    { label: "Derajat Keanggotaan (μ)", key: "nilai" },
  ];

  const fuzzifikasiTableRow = [
    {
      id: 1,
      variable: `Warna (${warnaKain})`,
      himpunan: warnaKain <= 5 ? "Gelap" : "Terang",
      rumus: `μTerang (${warnaKain}) = (${warnaKain} - 0) / (10 - 0) `,
      nilai: (warnaKain / 10).toFixed(2),
    },
    {
      id: 2,
      variable: `Ketebalan (${ketebalanKain})`,
      himpunan: ketebalanKain <= 5 ? "Tipis" : "Tebal",
      rumus: `μTebal (${ketebalanKain}) = (${ketebalanKain} - 0) / (10 - 0)`,
      nilai: (ketebalanKain / 10).toFixed(2),
    },
    {
      id: 3,
      variable: `Berat (${beratkain})`,
      himpunan: beratkain <= 15 ? "Ringan" : "Berat",
      rumus: `μBerat (${beratkain}) = (${beratkain} - 0) / (30 - 0)`,
      nilai: (beratkain / 30).toFixed(2),
    },
  ];

  // --- Tabel Aturan (Rule Evaluation) ---
  const AturanTableHead = [
    { label: "Rule", key: "rule" },
    { label: "Kondisi", key: "kondisi" },
    { label: "α-Predikat (Min)", key: "a" },
  ];

  const AturanTableRow = [
    {
      id: 1,
      rule: rules.map((r) => {
        if (r.alpha > 0.01) {
          return `${r.name}`;
        }
      }),
      kondisi: "Terang(0.6) AND Tebal(0.6) AND Berat(0.83)",
      a: "min(0.6, 0.6, 0.83) = 0.60",
    },
  ];

  // --- Tabel Nilai Z (Inference) ---
  const NilaiZTableHead = [
    { label: "Rule", key: "rulez" },
    { label: "Kategori Output", key: "output" },
    { label: "Rumus Z", key: "rumus_z" },
    { label: "Hasil z (ml)", key: "z" },
  ];

  const NilaiZTableRow = [
    {
      id: 1,
      rulez: rules.map((r) => {
        if (r.alpha > 0.01) {
          return `${r.name}`;
        }
      }),
      output: rules.map((r) => {
        if (r.alpha > 0.01) {
          return `${r.zType}`;
        }
      }),
      rumus_z: "20 + 0.6(100 - 20)",
      z: rules.map((r) => {
        if (r.alpha > 0.01) {
          return `${r.z}`;
        }
      }),
    },
  ];
  return (
    <Accordion
      type="multiple"
      className="w-full"
      defaultValue={["notifications"]}
    >
      <AccordionItem key="Fuzzifikasi" value="Fuzzifikasi">
        <AccordionTrigger>Fuzzifikasi</AccordionTrigger>
        <AccordionContent>
          <TableDemo
            tableHead={fuzzifikasiTableHead}
            tableRow={fuzzifikasiTableRow}
          />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem key="Aturan" value="Aturan">
        <AccordionTrigger>Aturan & Nilai a</AccordionTrigger>
        <AccordionContent>
          <TableDemo tableHead={AturanTableHead} tableRow={AturanTableRow} />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem key="Nilai" value="Nilai">
        <AccordionTrigger>Nilai z</AccordionTrigger>
        <AccordionContent>
          <TableDemo tableHead={NilaiZTableHead} tableRow={NilaiZTableRow} />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem key="Defuzzifikasi" value="Defuzzifikasi">
        <AccordionTrigger>Defuzzifikasi</AccordionTrigger>
        <AccordionContent>
          <h1 className="text-lg font-semibold">Ditampilkan sebagai Rumus</h1>

          <BlockMath math="Z = \frac{\sum(\alpha \cdot z)}{\sum \alpha}" />

          <h1 className="text-lg font-semibold">Hasil</h1>

          <BlockMath
            math={`Z = ${rules.map((r) => {
              if (r.alpha > 0.01) {
                return `${r.z}`;
              }
            })} { ml}`}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
