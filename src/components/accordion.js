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
  const { rulesMinGlobal } = usePerhitungan();
  const fuzzifikasiTableHead = [
    { label: "Himpunan", key: "himpunan" },
    { label: "Rumus", key: "rumus" },
    { label: "Hasil", key: "nilai" },
  ];

  const fuzzifikasiTableRowWarna = [
    {
      id: 1,
      himpunan: "Gelap",
      rumus: `(10 - ${warnaKain}) /10`,
      nilai: ((10 - warnaKain) / 10).toFixed(2),
    },
    {
      id: 2,
      himpunan: "Terang",
      rumus: `${warnaKain}/10`,
      nilai: (warnaKain / 10).toFixed(2),
    },
  ];
  const fuzzifikasiTableRowKetebalan = [
    {
      id: 1,
      himpunan: "Tipis",
      rumus: `(10 - ${ketebalanKain}) /10`,
      nilai: ((10 - ketebalanKain) / 10).toFixed(2),
    },
    {
      id: 2,
      himpunan: "Tebal",
      rumus: `${ketebalanKain}/10`,
      nilai: (ketebalanKain / 10).toFixed(2),
    },
  ];
  const fuzzifikasiTableRowBerat = [
    {
      id: 1,
      himpunan: "Tipis",
      rumus: `(30 - ${beratkain}) /30`,
      nilai: ((30 - beratkain) / 30).toFixed(2),
    },
    {
      id: 2,
      himpunan: "Tebal",
      rumus: `${beratkain}/30`,
      nilai: (beratkain / 30).toFixed(2),
    },
  ];

  // --- Tabel Aturan (Rule Evaluation) ---
  const RuleTableHead = [
    { label: "Rule", key: "rule" },
    { label: "If", key: "if" },
    { label: "AND", key: "and" },
    { label: "THEN", key: "then" },
  ];

  const RuleTableRow = [
    {
      id: 1,
      rule: "R1",
      if: "Ketebalan Tebal",
      and: "Berat Berat",
      then: "Deterjen Banyak",
    },
    {
      id: 2,
      rule: "R2",
      if: "Ketebalan Tipis",
      and: "Berat Ringan",
      then: "Deterjen Sedikit",
    },
    {
      id: 3,
      rule: "R3",
      if: "Warna Gelap",
      and: "Berat Berat",
      then: "Deterjen Banyak",
    },
    {
      id: 4,
      rule: "R4",
      if: "Warna Terang",
      and: "Berat Ringan",
      then: "Deterjen Sedikit",
    },
  ];
  const AturanTableHead = [
    { label: "Rule", key: "rule" },
    { label: "Nilai 1", key: "nilai1" },
    { label: "Nilai 2", key: "nilai2" },
    { label: "α-Predikat (Min)", key: "a" },
    { label: "Output", key: "o" },
  ];

  const AturanTableRow = [
    {
      id: 1,
      rule: "R1",
      nilai1: `Tebal = 1`,
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
          <div className="my-2 ">
            <h1 className="font-medium underline">Warna 0-10</h1>
            <TableDemo
              tableHead={fuzzifikasiTableHead}
              tableRow={fuzzifikasiTableRowWarna}
            />
          </div>
          <div className="my-2 ">
            <h1 className="font-medium underline">Ketebalan 0-10</h1>
            <TableDemo
              tableHead={fuzzifikasiTableHead}
              tableRow={fuzzifikasiTableRowKetebalan}
            />
          </div>
          <div className="my-2 ">
            <h1 className="font-medium underline">Berat 0-30</h1>
            <TableDemo
              tableHead={fuzzifikasiTableHead}
              tableRow={fuzzifikasiTableRowBerat}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem key="Rule" value="Rule">
        <AccordionTrigger>Tabel Rule</AccordionTrigger>
        <AccordionContent>
          <TableDemo tableHead={RuleTableHead} tableRow={RuleTableRow} />
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
